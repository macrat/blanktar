import {NextApiRequest, NextApiResponse} from 'next';

import posts, {hash} from '../../../lib/posts';
import withCache from '../../../lib/api/cache';
import createETag from '../../../lib/api/etag';


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

    const queries = query.toLowerCase().split(' ');

    let filtered = posts;

    queries.forEach(q => {
        filtered = filtered.filter(x => (
            x.lowerTitle.includes(q)
            || x.lowerTags.includes(q)
            || x.lowerContent.includes(q)
        ));
    });

    res.json({
        posts: filtered.slice(offset, offset + limit).map(p => {
            const sanitize = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            const title = queries.reduce((s, q) => {
                const re = new RegExp(sanitize(q).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'ig');
                return s.replace(re, `<mark>${q}</mark>`);
            }, sanitize(p.title));

            const summary = queries.reduce((s, q) => {
                const re = new RegExp(sanitize(q).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'ig');
                return s.replace(re, `<mark>${q}</mark>`);
            }, sanitize(p.description || ''));

            return {
                title: title,
                href: p.href,
                pubtime: p.pubtime,
                summary: summary,
            };
        }),
        totalCount: filtered.length,
    });
}, {
    etag: (req: NextApiRequest) => (
        createETag(hash + String(req.query.q).toLowerCase())
    ),
    control: 'public, max-age=604800',
});
