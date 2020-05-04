import {createHash} from 'crypto';
import {createWriteStream, promises as fs} from 'fs';
import {Readable, Transform} from 'stream';

import fetch from 'node-fetch';
import sharp, {Sharp} from 'sharp';
import mozjpeg from 'imagemin-mozjpeg';
import zopflipng from 'imagemin-zopfli';
import webp from 'imagemin-webp';
import {Potrace} from 'potrace';
import penv from 'penv.macro';


export type ImageSize = {
    width: number;
    height: number;
};


export type ImageSet = {
    mdpi: string;
    hdpi: string;
    srcSet: string;
}[];


export type OptimizedImage = ImageSize & {
    images: ImageSet;
};


export type TracedImage = {
    viewBox: string;
    path: string;
};


class Compressor extends Transform {
    private readonly compressor: (img: Buffer) => Promise<Buffer>;

    private readonly bufs: Buffer[];

    constructor(compressor: ((img: Buffer) => Promise<Buffer>)) {
        super();

        this.compressor = compressor;
        this.bufs = [];
    }

    _transform(chunk: Buffer, encoding: string, callback: () => void): void {
        this.bufs.push(chunk);
        callback();
    }

    _finish(callback: (err?: Error) => void): void {
        this.compressor(Buffer.concat(this.bufs))
            .then(output => {
                this.push(output);
                callback();
            })
            .catch(err => callback(err));
    }
}


function jpegCompressor(): Compressor {
    return new Compressor(mozjpeg({quality: 80}));
}


function pngCompressor(transparent: boolean): Compressor {
    return new Compressor(zopflipng({transparent}));
}


function commonCompressor(hasAlpha?: boolean): Compressor {
    return pngCompressor(hasAlpha ?? false).pipe(jpegCompressor())
}


function webpCompressor(format?: string): Compressor {
    return new Compressor(webp({
        lossless: format === 'png',
        quality: 60,
        method: penv({
            production: 6,
        }, 0),
    }));
}


function getExtension(format: string): string {
    if (format === 'jpeg') {
        return 'jpg';
    }
    return format;
}


async function writeTask(path: string, task: () => Readable): Promise<void> {
    try {
        await fs.access(path);
    } catch {
        task().pipe(createWriteStream(path));
    }
}


async function tracePath(image: Buffer): Promise<string> {
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
}


export default class Image {
    private readonly raw: string | Buffer;

    constructor(raw: string | Buffer) {
        this.raw = raw;
    }

    static async download(url: string): Promise<Image> {
        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error(`failed to download image: ${resp.status} ${resp.statusText}`);
        }

        return new Image(await resp.buffer());
    }

    async size(): Promise<ImageSize> {
        const {width, height} = await sharp(this.raw).metadata();
        if (!width || !height) {
            throw new Error('failed to get image size');
        }
        return {width, height};
    }

    async hash(): Promise<string> {
        return createHash('md5').update(await sharp(this.raw).raw().toBuffer()).digest('hex');
    }

    async optimize(path: string, width: number): Promise<OptimizedImage> {
        await fs.mkdir(`./.next/static/${path}`, {recursive: true}).catch(() => null);

        const img = sharp(this.raw);
        const metadata = await img.metadata();
        const extension = metadata.format === undefined ? 'jpg' : getExtension(metadata.format);
        const hash = await this.hash();

        if (!metadata.width || !metadata.height) {
            throw new Error('failed to get image size');
        }

        const stream = sharp();
        const x2 = img.clone().resize(width * 2);
        const x1 = img.clone().resize(width);

        await writeTask(
            `./.next/static/${path}/${hash}@2x.${extension}`,
            () => x2.clone().pipe(commonCompressor(metadata.hasAlpha)),
        );
        await writeTask(
            `./.next/static/${path}/${hash}.${extension}`,
            () => x1.clone().pipe(commonCompressor(metadata.hasAlpha)),
        );

        await writeTask(
            `./.next/static/${path}/${hash}@2x.webp`,
            () => x2.clone().pipe(webpCompressor(metadata.format)),
        );
        await writeTask(
            `./.next/static/${path}/${hash}.webp`,
            () => x1.clone().pipe(webpCompressor(metadata.format)),
        );

        img.pipe(stream);

        const hdpi = `/_next/static/${path}/${hash}@2x.`;
        const mdpi = `/_next/static/${path}/${hash}.`;

        return {
            images: [{
                mdpi: mdpi + 'webp',
                hdpi: hdpi + 'webp',
                srcSet: `${hdpi}webp 2x, ${mdpi}webp 1x`,
            }, {
                mdpi: mdpi + extension,
                hdpi: hdpi + extension,
                srcSet: `${hdpi}${extension} 2x, ${mdpi}${extension} 1x`,
            }],
            width: width,
            height: Math.round(width * metadata.height / metadata.width),
        };
    }

    async trace(): Promise<TracedImage> {
        const {width, height} = await this.size();

        return {
            viewBox: `0 0 240 ${Math.round(240 * height / width)}`,
            path: await tracePath(await sharp(this.raw).resize({width: 240}).toBuffer())
        };
    }
}
