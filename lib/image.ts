import {createHash} from 'crypto';
import {promises as fs} from 'fs';
import Jimp from 'jimp';
import mozjpeg from 'imagemin-mozjpeg';
import zopflipng from 'imagemin-zopfli';
import webp from 'imagemin-webp';
import {Potrace} from 'potrace';
import penv from 'penv.macro';


const writeTask = async (path: string, task: () => Promise<Buffer>) => {
    try {
        await fs.access(path);
    } catch {
        await fs.writeFile(path, await task());
    }
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


export default class Image {
    private readonly img: Jimp;

    private constructor(img: Jimp) {
        this.img = img;
    }

    public static async read(src: string): Promise<Image> {
        return new Image(await Jimp.read(src));
    }

    get size(): ImageSize {
        return {
            width: this.img.bitmap.width,
            height: this.img.bitmap.height,
        };
    }

    get mimetype(): string {
        return this.img.getMIME();
    }

    get extension(): string {
        const ext = this.img.getExtension();
        if (ext === 'jpeg') {
            return 'jpg';
        }
        return ext;
    }

    hash(): string {
        return createHash('md5').update(this.img.bitmap.data).digest('hex');
    }

    private async resize(width: number): Promise<Buffer> {
        return await this.img.clone().resize(width, Jimp.AUTO).getBufferAsync(this.mimetype);
    }

    private async compress(img: Buffer): Promise<Buffer> {
        switch (this.mimetype) {
        case 'image/jpeg':
            return await mozjpeg({quality: 80})(img);
        case 'image/png':
            return await zopflipng({transparent: this.img.hasAlpha()})(img);
        default:
            return img;
        }
    }

    private async webpCompress(img: Buffer): Promise<Buffer> {
        return await webp({
            lossless: this.mimetype === 'image/png',
            preset: this.mimetype === 'image/jpeg' ? 'photo' : 'default',
            method: penv({
                production: 6,
            }, 0),
        })(img);
    }

    async optimize(path: string, width: number): Promise<OptimizedImage> {
        await fs.mkdir(`./.next/static/${path}`, {recursive: true}).catch(() => null);

        const hash = this.hash();

        await writeTask(
            `./.next/static/${path}/${hash}@2x.${this.extension}`,
            async () => await this.compress(await this.resize(width*2)),
        );
        await writeTask(
            `./.next/static/${path}/${hash}.${this.extension}`,
            async () => await this.compress(await this.resize(width)),
        );

        await writeTask(
            `./.next/static/${path}/${hash}@2x.webp`,
            async () => await this.webpCompress(await this.resize(width*2)),
        );
        await writeTask(
            `./.next/static/${path}/${hash}.webp`,
            async () => await this.webpCompress(await this.resize(width)),
        );

        const hdpi = `/_next/static/${path}/${hash}@2x.`;
        const mdpi = `/_next/static/${path}/${hash}.`;

        return {
            images: [{
                mdpi: mdpi + 'webp',
                hdpi: hdpi + 'webp',
                srcSet: `${hdpi}webp 2x, ${mdpi}webp 1x`,
            }, {
                mdpi: mdpi + this.extension,
                hdpi: hdpi + this.extension,
                srcSet: `${hdpi}${this.extension} 2x, ${mdpi}${this.extension} 1x`,
            }],
            width: width,
            height: Math.round(width * this.size.height / this.size.width),
        };
    }

    async trace(): Promise<TracedImage> {
        return {
            viewBox: `0 0 240 ${Math.round(240 * this.size.height / this.size.width)}`,
            path: await tracePath(await this.resize(240))
        };
    }
}
