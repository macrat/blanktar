const xmlbuilder = require('xmlbuilder');

const posts = require('../posts/loader');


const BASE_URL = 'https://blanktar.jp';


const years = Array.from(new Set(posts.map(x => x.year))).map(y => {
    const latest_post =  posts.filter(p => p.year === y).reduce((a, b) => {
        if ((a.modtime || a.pubtime) > (b.modtime || b.pubtime)) {
            return a;
        } else {
            return b;
        }
    });

    return {
        loc: `${BASE_URL}/blog/${y}`,
        lastmod: latest_post.modtime || latest_post.pubtime,
    };
});


const months = Array.from(new Set(posts.map(x => `${x.year}/${x.month}`))).map(stem => {
    const latest_post =  posts.filter(p => `${p.year}/${p.month}` === stem).reduce((a, b) => {
        if ((a.modtime || a.pubtime) > (b.modtime || b.pubtime)) {
            return a;
        } else {
            return b;
        }
    });

    return {
        loc: `${BASE_URL}/blog/${stem}`,
        lastmod: latest_post.modtime || latest_post.pubtime,
    };
});


module.exports = xmlbuilder.create({
    urlset: {
        '@xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
        '@xml:lang': 'ja',
        url: [
            {loc: BASE_URL},
            {loc: BASE_URL + '/about'},
            {loc: BASE_URL + '/works'},
            {loc: BASE_URL + '/photos'},
            {
                loc: BASE_URL + '/blog',
                lastmod: posts[0].pubtime,
            },
            ...years,
            ...months,
            ...posts.map(p => ({
                loc: BASE_URL + p.href,
                lastmod: p.modtime || p.pubtime,
            })),
        ],
    },
}).end();
