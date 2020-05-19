import {createHash} from 'crypto';
import {promises as fs} from 'fs';

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


async function compressJpeg(image: Buffer): Promise<Buffer> {
    return await mozjpeg({quality: 80})(image);
}


async function compressPng(image: Buffer, transparent: boolean): Promise<Buffer> {
    return await zopflipng({transparent})(image);
}


async function compress(image: Buffer, {format, hasAlpha}: {format?: string; hasAlpha?: boolean}): Promise<Buffer> {
    if (format === 'png' || format === 'gif' || format == 'bmp') {
        return await compressPng(image, hasAlpha ?? false);
    }
    return await compressJpeg(image);
}


async function compressWebp(image: Buffer, {format}: {format?: string}): Promise<Buffer> {
    return await webp({
        lossless: format === 'png',
        quality: 60,
        method: penv({
            production: 6,
        }, 0),
    })(image);
}


function getExtension(format: string): string {
    if (format === 'jpeg') {
        return 'jpg';
    }
    return format;
}


async function writeTask(path: string, task: () => Promise<Buffer>): Promise<void> {
    try {
        await fs.access(path);
    } catch {
        await fs.writeFile(path, await task());
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
    private readonly img: Sharp;

    constructor(img: Sharp | string) {
        this.img = typeof img === 'string' ? sharp(img) : img;
    }

    static async download(url: string): Promise<Image> {
        const resp = await fetch(url);

        if (!resp.ok) {
            throw new Error(`failed to download image: ${resp.status} ${resp.statusText}`);
        }

        return new Image(sharp(Buffer.from(await resp.arrayBuffer())));
    }

    async size(): Promise<ImageSize> {
        const {width, height} = await this.img.metadata();
        if (!width || !height) {
            throw new Error('failed to get image size');
        }
        return {width, height};
    }

    async hash(): Promise<string> {
        return createHash('md5').update(await this.img.clone().raw().toBuffer()).digest('hex');
    }

    async optimize(path: string, width: number): Promise<OptimizedImage> {
        await fs.mkdir(`./.next/static/${path}`, {recursive: true}).catch(() => null);

        const metadata = await this.img.metadata();
        const extension = metadata.format === undefined ? 'jpg' : getExtension(metadata.format);
        const hash = await this.hash();

        if (!metadata.width || !metadata.height) {
            throw new Error('failed to get image size');
        }

        const x2 = this.img.clone().resize(width * 2);
        const x1 = this.img.clone().resize(width);

        await writeTask(
            `./.next/static/${path}/${hash}@2x.${extension}`,
            async () => await compress(await x2.clone().toBuffer(), metadata),
        );
        await writeTask(
            `./.next/static/${path}/${hash}.${extension}`,
            async () => await compress(await x1.clone().toBuffer(), metadata),
        );

        await writeTask(
            `./.next/static/${path}/${hash}@2x.webp`,
            async () => await compressWebp(await x2.clone().toBuffer(), metadata),
        );
        await writeTask(
            `./.next/static/${path}/${hash}.webp`,
            async () => await compressWebp(await x1.clone().toBuffer(), metadata),
        );

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
            path: await tracePath(await this.img.clone().resize({width: 240}).toBuffer())
        };
    }
}
