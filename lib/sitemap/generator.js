const xmlbuilder = require('xmlbuilder');


const posts = require('../posts/loader').map(x => ({
    ...x,
    pubtime: new Date(x.pubtime).toISOString(),
    modtime: x.modtime ? new Date(x.modtime).toISOString() : undefined,
}));


const BASE_URL = 'https://blanktar.jp';


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
            ...posts.map(p => ({
                loc: BASE_URL + p.href,
                lastmod: p.modtime || p.pubtime,
            })),
        ],
    },
}).end();
