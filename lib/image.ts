import fetch from 'node-fetch';
import {createHash} from 'crypto';
import {promises as fs} from 'fs';
import Jimp from 'jimp';
import mozjpeg from 'imagemin-mozjpeg';
import zopflipng from 'imagemin-zopfli';
import {Potrace} from 'potrace';


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


export default class Image {
    private readonly img: Jimp;

    private constructor(img: Jimp) {
        this.img = img;
    }

    public static async read(src: string) {
        return new Image(await Jimp.read(src));
    }

    get size() {
        return {
            width: this.img.bitmap.width,
            height: this.img.bitmap.height,
        };
    }

    get mimetype() {
        return this.img.getMIME();
    }

    get extension() {
        const ext = this.img.getExtension();
        if (ext === 'jpeg') {
            return 'jpg';
        }
        return ext;
    }

    hash() {
        return createHash('md5').update(this.img.bitmap.data).digest('hex');
    }

    private async resize(width: number) {
        return await this.img.resize(width, Jimp.AUTO).getBufferAsync(this.mimetype);
    }

    private async compress(img: Buffer) {
        switch (this.mimetype) {
        case 'image/jpeg':
            return await mozjpeg({quality: 80})(img);
        case 'image/png':
            return await zopflipng({transparent: this.img.hasAlpha()})(img);
        default:
            return img;
        }
    }

    async optimize(path: string, width: number) {
        try {
            await fs.mkdir(`./.next/static/${path}`, {recursive: true});
        } catch(e) {}

        const hash = this.hash();

        await fs.writeFile(
            `./.next/static/${path}/${hash}@2x.${this.extension}`,
            await this.compress(await this.resize(width*2)),
        );
        await fs.writeFile(
            `./.next/static/${path}/${hash}.${this.extension}`,
            await this.compress(await this.resize(width)),
        );

        const hdpi = `/_next/static/${path}/${hash}@2x.${this.extension}`;
        const mdpi = `/_next/static/${path}/${hash}.${this.extension}`;

        return {
            mdpi: mdpi,
            hdpi: hdpi,
            srcSet: `${hdpi} 2x, ${mdpi} 1x`,
            width: width,
            height: width * this.size.height / this.size.width,
        };
    }

    async trace() {
        return {
            viewBox: `0 0 240 ${240 * this.size.height / this.size.width}`,
            path: await tracePath(await this.resize(240))
        };
    }
};
