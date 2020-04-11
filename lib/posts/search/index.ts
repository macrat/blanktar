import posts from '../';


export default (query: string, offset: number, limit: number) => {
    const queries = query.toLowerCase().split(' ');

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
                return s.replace(re, `<mark>${q}</mark>`);
            }, sanitize(p.title));

            const summary = queries.reduce((s, q) => {
                const re = new RegExp(sanitize(q).replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'ig');
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
    };
};
