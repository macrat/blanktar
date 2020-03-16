import {NextApiRequest, NextApiResponse} from 'next';
import {promises as fs, constants} from 'fs';
import {createCanvas, registerFont, Image} from 'canvas';
import fetch from 'isomorphic-unfetch';
import preval from 'preval.macro';


let fontLoaded = false;
const loadFont = async (origin: String) => {
    if (fontLoaded) {
        return
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


const baseImage = () => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = err => reject(err);

        img.src = preval`
            const fs = require('fs');
            module.exports = 'data:image/svg+xml;base64,' + fs.readFileSync('./assets/eyecatch-base.svg', 'base64');
        `;
    });
};


export default async (req: NextApiRequest, res: NextApiResponse) => {
    await loadFont(req.headers.host || 'localhost');

    const canvas = createCanvas(1200, 1200);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(await baseImage(), 0, 0, 1200, 1200);

    ctx.font = 'Light 72px NotoSansJP';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#402020';

    const title = String(req.query.title || '');
    const size = ctx.measureText(title);

    if (size.width > 1200-120) {
        ctx.fillText(title.slice(0, title.length/2), 600, 600 - size.emHeightAscent/2, 1200-120);
        ctx.fillText(title.slice(title.length/2), 600, 600 + size.emHeightAscent/2, 1200-120);
    } else {
        ctx.fillText(title, 600, 600, 1200-120);
    }

    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Content-Type', 'image/png');
    res.send(canvas.toBuffer());
};
