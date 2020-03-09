import {NextApiRequest, NextApiResponse} from 'next';
import {createCanvas, registerFont, loadImage} from 'canvas';


registerFont('./assets/NotoSansCJKjp-Light.otf', {family: 'NotoSansJP', weight: 'Light'});


export default async (req: NextApiRequest, res: NextApiResponse) => {
    const canvas = createCanvas(1200, 1200);
    const ctx = canvas.getContext('2d');

    const base = await loadImage('./assets/eyecatch-base.svg');
    ctx.drawImage(base, 0, 0, 1200, 1200);

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
