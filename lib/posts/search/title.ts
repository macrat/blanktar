import posts from '../';


export default (query: string) => {
    let filtered = posts;

    query.toLowerCase().split(' ').forEach(q => {
        filtered = filtered.filter(x => x.lowerTitle.includes(q));
    });

    return {
        posts: filtered.slice(0, 5).map(p => ({
            title: p.title,
            href: p.href,
        })),
    };
};
