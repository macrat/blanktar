import {NextApiRequest, NextApiResponse} from 'next';
import fetch from 'node-fetch';
import {createHash} from 'crypto';

import createETag from '~/lib/api/etag';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    const resp = await fetch('https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
        },
    });

    const link = resp.headers.get('Link');
    if (link) res.setHeader('Link', link);

    const css = await resp.text();
    const etag = createETag(css);

    res.setHeader('ETag', etag);

    if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
        return
    }

    res.send(css);
};
