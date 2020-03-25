import {NextApiRequest, NextApiResponse} from 'next';

import {hash} from '~/lib/posts';
import search from '~/lib/posts/search';
import withCache from '~/lib/api/cache';
import createETag from '~/lib/api/etag';


export type SuccessResponse = {
    posts: {
        title: string,
        href: string,
        pubtime: string,
        summary: string,
    }[],
    totalCount: number,
};


export type Response = SuccessResponse | {
    error: string,
};


export default withCache(async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    res.setHeader('Cache-Control', 'public, max-age=604800');

    const query = String(req.query.q);
    const offset = Number(req.query.offset || 0);
    const limit = Number(req.query.limit || 10);

    if (req.method !== 'GET') {
        res.status(405).json({error: 'method not allowed'});
    }
    if (!query) {
        res.status(400).json({error: '`q` is required'});
    }

    res.json(search(query, offset, limit));
}, {
    etag: (req: NextApiRequest) => (
        createETag(hash + String(req.query.q).toLowerCase())
    ),
    control: 'public, max-age=604800',
});
