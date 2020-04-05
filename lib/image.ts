import fetch from 'node-fetch';
import {createHash} from 'crypto';
import {promises as fs} from 'fs';
import {Image} from 'canvas';
import sharp from 'sharp';
import mozjpeg from 'imagemin-mozjpeg';


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


export const optimizeImage = async (src: string) => {
    const resp = await fetch(src);
    if (!resp.ok) {
        throw new Error(`failed to get image: ${original.status} ${original.statusText}: ${url}`);
    }
    const original = await resp.buffer();

    const hash = createHash('md5').update(original).digest('hex');

    try {
        await fs.mkdir('./.next/static/photos', {recrusive: true});
    } catch(e) {}

    const compress = mozjpeg({quality: 80});

    await fs.writeFile(
        `./.next/static/photos/${hash}@2x.jpg`,
        await sharp(original)
            .resize(960)
            .toBuffer()
            .then(compress)
    );
    await fs.writeFile(
        `./.next/static/photos/${hash}.jpg`,
        await sharp(original)
            .resize(480)
            .toBuffer()
            .then(compress)
    );

    return {
        mdpi: `/_next/static/photos/${hash}.jpg`,
        hdpi: `/_next/static/photos/${hash}@2x.jpg`,
    };
};
