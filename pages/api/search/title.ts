import { NextApiRequest, NextApiResponse } from 'next';

import { hash } from '~/lib/posts';
import search from '~/lib/posts/search/title';
import withCache from '~/lib/api/cache';
import createETag from '~/lib/api/etag';


export type SuccessResponse = {
    posts: {
        title: string;
        href: string;
    }[];
};


export type Response = SuccessResponse | {
    error: string;
};


export default withCache(async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    const query = String(req.query.q);

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'method not allowed' });
    }
    if (!query) {
        res.status(400).json({ error: '`q` is required' });
    }

    res.json(search(query));
}, {
    etag: (req: NextApiRequest) => (
        createETag(hash + String(req.query.q).toLowerCase())
    ),
    control: 'public, max-age=604800',
});
