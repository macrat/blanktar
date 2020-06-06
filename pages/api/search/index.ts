import { NextApiRequest, NextApiResponse } from 'next';

import { hash } from '~/lib/posts';
import search from '~/lib/posts/search';
import getSnippet from '~/lib/rich-snippet';
import withCache from '~/lib/api/cache';
import createETag from '~/lib/api/etag';


export type SuccessResponse = {
    posts: {
        title: string;
        href: string;
        pubtime: number;
        summary: string;
    }[];
    totalCount: number;
    snippet?: {
        html: string;
        summary: string;
    };
};


export type Response = SuccessResponse | {
    error: string;
};


export default withCache(async (req: NextApiRequest, res: NextApiResponse<Response>) => {
    res.setHeader('Cache-Control', 'public, max-age=604800');

    const query = String(req.query.q);
    const offset = Number.isNaN(Number(req.query.offset)) ? 0 : Number(req.query.offset);
    const limit = Number.isNaN(Number(req.query.limit)) ? 10 : Number(req.query.limit);

    if (req.method !== 'GET') {
        res.status(405).json({ error: 'method not allowed' });
    }
    if (!query) {
        res.status(400).json({ error: '`q` is required' });
    }

    res.json({
        ...search(query, offset, limit),
        snippet: getSnippet(query),
    });
}, {
    etag: (req: NextApiRequest) => (
        createETag(hash + String(req.query.q).toLowerCase())
    ),
    control: 'public, max-age=604800',
});
