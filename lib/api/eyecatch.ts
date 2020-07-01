import { promises as fs, constants } from 'fs';
import { createHash } from 'crypto';

import { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, registerFont, loadImage } from 'canvas';

import withCache from './cache';
import createETag from './etag';


let fontLoaded = false;
const loadFont = async (origin: string) => {
    if (fontLoaded) {
        return;
    }

    let fontPath = './assets/NotoSansJP-Regular.otf';
    try {
        await fs.access(fontPath);
    } catch {
        fontPath = '/tmp/NotoSansJP-Regular.otf';

        try {
            await fs.access(fontPath, constants.R_OK);
        } catch {
            await fs.writeFile(
                fontPath,
                Buffer.from(await (await fetch(`http://${origin}/assets/NotoSansJP-Regular.otf`)).arrayBuffer()),
            );
        }
    }

    registerFont(fontPath, { family: 'NotoSansJP', weight: 'Regular' });

    fontLoaded = true;
};


export default (baseImageSVG: string, width: number, height: number) => {
    const baseImageURI = 'data:image/svg+xml;base64,' + Buffer.from(baseImageSVG).toString('base64');
    const hash = createHash('md5').update(baseImageSVG).digest('hex');

    return withCache(async (req: NextApiRequest, res: NextApiResponse) => {
        await loadFont(req.headers.host ?? 'localhost');

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(await loadImage(baseImageURI), 0, 0, width, height);

        ctx.font = 'Regular 72px NotoSansJP';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#402020';

        const title = String(req.query.title);
        const size = ctx.measureText(title);

        const x = width / 2;
        const y = height / 2 + 28;

        if (size.width > 1200-120) {
            ctx.fillText(title.slice(0, title.length/2), x, y - size.emHeightAscent/2, width-120);
            ctx.fillText(title.slice(title.length/2), x, y + size.emHeightAscent/2, width-120);
        } else {
            ctx.fillText(title, x, y, width-120);
        }

        res.setHeader('Content-Type', 'image/png');
        res.send(canvas.toBuffer());
    }, {
        etag: (req: NextApiRequest) => createETag(hash + req.query.title),
        control: 'public, max-age=31536000, immutable',
    });
};
