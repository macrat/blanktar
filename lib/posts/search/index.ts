import { default as defaultPosts, Post } from '../';


export default (query: string, offset: number, limit: number, posts: Post[] = defaultPosts) => {
    const queries = query.toLowerCase().split(' ').map(x => x.trim()).filter(x => x);

    if (queries.length === 0) {
        return {
            posts: [],
            totalCount: 0,
        };
    }

    let filtered = posts;

    queries.forEach(q => {
        filtered = filtered.filter(x => (
            x.lowerTitle.includes(q)
            || x.lowerTags.includes(q)
            || x.lowerContent.includes(q)
        ));
    });

    return {
        posts: filtered.slice(offset, offset + limit).map(p => {
            const sanitize = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;');

            const title = queries.reduce((s, q) => {
                const re = new RegExp(sanitize(q).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'ig');
                return s.replace(re, '<mark>$&</mark>');
            }, sanitize(p.title));

            const summary = queries.reduce((s, q) => {
                const re = new RegExp(sanitize(q).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'ig');
                return s.replace(re, '<mark>$&</mark>');
            }, sanitize(p.description ?? ''));

            return {
                title: title,
                href: p.href,
                pubtime: p.pubtime,
                summary: summary,
            };
        }),
        totalCount: filtered.length,
    };
};
