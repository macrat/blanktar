import {promises as fs, constants} from 'fs';
import {createHash} from 'crypto';

import {NextApiRequest, NextApiResponse} from 'next';
import {createCanvas, registerFont, Image} from 'canvas';
import fetch from 'node-fetch';

import withCache from '~/lib/api/cache';
import createETag from '~/lib/api/etag';


let fontLoaded = false;
const loadFont = async (origin: string) => {
    if (fontLoaded) {
        return;
    }

    let fontPath = './assets/NotoSansCJKjp-Light.otf';
    try {
        await fs.access(fontPath);
    } catch {
        fontPath = '/tmp/NotoSansCJKjp-Light.otf';

        try {
            await fs.access(fontPath, constants.R_OK);
        } catch {
            await fs.writeFile(
                fontPath,
                Buffer.from(await (await fetch(`http://${origin}/assets/NotoSansCJKjp-Light.otf`)).arrayBuffer()),
            );
        }
    }

    registerFont(fontPath, {family: 'NotoSansJP', weight: 'Light'});

    fontLoaded = true;
};


const baseImageSVG = require('~/assets/eyecatch-base.svg') as string;  // eslint-disable-line @typescript-eslint/no-var-requires
const baseImageURI = 'data:image/svg+xml;base64,' + Buffer.from(baseImageSVG).toString('base64');
const hash = createHash('md5').update(baseImageSVG).digest('hex');


const baseImage = () => {
    return new Promise<Image>((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = err => reject(err);

        img.src = baseImageURI;
    });
};


export default withCache(async (req: NextApiRequest, res: NextApiResponse) => {
    await loadFont(req.headers.host ?? 'localhost');

    const canvas = createCanvas(1200, 1200);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(await baseImage(), 0, 0, 1200, 1200);

    ctx.font = 'Light 72px NotoSansJP';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#402020';

    const title = String(req.query.title);
    const size = ctx.measureText(title);

    if (size.width > 1200-120) {
        ctx.fillText(title.slice(0, title.length/2), 600, 600 - size.emHeightAscent/2, 1200-120);
        ctx.fillText(title.slice(title.length/2), 600, 600 + size.emHeightAscent/2, 1200-120);
    } else {
        ctx.fillText(title, 600, 600, 1200-120);
    }

    res.setHeader('Content-Type', 'image/png');
    res.send(canvas.toBuffer());
}, {
    etag: (req: NextApiRequest) => createETag(hash + req.query.title),
    control: 'public, max-age=31536000, immutable',
});
