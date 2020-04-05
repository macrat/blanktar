import fetch from 'node-fetch';
import {createHash} from 'crypto';
import {promises as fs} from 'fs';
import {Image} from 'canvas';
import Jimp from 'jimp';
import mozjpeg from 'imagemin-mozjpeg';
import {Potrace} from 'potrace';


export const loadImage = (src: string) => {
    return new Promise<Image>((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = err => reject(err);

        img.src = src;
    })
};


export const detectSize = async (src: string) => {
    const img = await loadImage(src);

    return {
        width: img.naturalWidth,
        height: img.naturalHeight,
    };
};


const tracePath = (image: Buffer) => {
    return new Promise<string>((resolve, reject) => {
        const trace = new Potrace();
        trace.setParameters({
            turdSize: 200,
            color: 'var(--colors-img-trace)',
        });
        trace.loadImage(image, err => {
            if (err) {
                reject(err);
            } else {
                resolve(trace.getPathTag());
            }
        });
    });
};


export const optimizeImage = async (src: string) => {
    const resp = await fetch(src);
    if (!resp.ok) {
        throw new Error(`failed to get image: ${resp.status} ${resp.statusText}: ${src}`);
    }
    const original = await resp.buffer();

    const hash = createHash('md5').update(original).digest('hex');

    try {
        await fs.mkdir('./.next/static/photos', {recursive: true});
    } catch(e) {}

    const compress = mozjpeg({quality: 80});

    const img = await Jimp.read(original);

    await fs.writeFile(
        `./.next/static/photos/${hash}@2x.jpg`,
        await img
            .resize(960, Jimp.AUTO)
            .getBufferAsync(img.getMIME())
            .then(compress)
    );
    await fs.writeFile(
        `./.next/static/photos/${hash}.jpg`,
        await img
            .resize(480, Jimp.AUTO)
            .getBufferAsync(img.getMIME())
            .then(compress)
    );

    return {
        mdpi: `/_next/static/photos/${hash}.jpg`,
        hdpi: `/_next/static/photos/${hash}@2x.jpg`,
        tracePath: await tracePath(await img.resize(480, Jimp.AUTO).getBufferAsync(img.getMIME())),
    };
};
