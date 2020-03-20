import {NextApiRequest, NextApiResponse} from 'next';

import posts from '../../../lib/posts';


export type SuccessResponse = {
    posts: {
        title: string,
        href: string,
    }[],
};


export type Response = SuccessResponse | {
    error: string,
};


export default async (req: NextApiRequest, res: NextApiResponse<Response>) => {
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
};
