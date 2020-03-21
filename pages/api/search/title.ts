import {NextApiRequest, NextApiResponse} from 'next';

import posts, {hash} from '../../../lib/posts';
import withCache from '../../../lib/api/cache';
import createETag from '../../../lib/api/etag';


export type SuccessResponse = {
    posts: {
        title: string,
        href: string,
    }[],
};


export type Response = SuccessResponse | {
    error: string,
};


export default withCache(async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const query = String(req.query.q);

    if (req.method !== 'GET') {
        res.status(405).json({error: 'method not allowed'});
    }
    if (!query) {
        res.status(400).json({error: '`q` is required'});
    }

    let filtered = posts;

    query.toLowerCase().split(' ').forEach(q => {
        filtered = filtered.filter(x => x.lowerTitle.includes(q));
    });

    res.json({
        posts: filtered.slice(0, 5).map(p => ({
            title: p.title,
            href: p.href,
        })),
    });
}, {
    etag: (req: NextApiRequest) => (
        createETag(hash + String(req.query.q).toLowerCase())
    ),
    control: 'public, max-age=604800',
});
