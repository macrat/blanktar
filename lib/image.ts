import sharp, { Sharp } from 'sharp';
import { Potrace } from 'potrace';


export type ImageSize = {
    width: number;
    height: number;
};


export type TracedImage = {
    viewBox: string;
    path: string;
};


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
        const { width, height } = await this.img.metadata();
        if (!width || !height) {
            throw new Error('failed to get image size');
        }
        return { width, height };
    }

    async trace(): Promise<TracedImage> {
        const { width, height } = await this.size();

        return {
            viewBox: `0 0 240 ${Math.round(240 * height / width)}`,
            path: await tracePath(await this.img.clone().resize({ width: 240 }).toBuffer())
        };
    }
}
