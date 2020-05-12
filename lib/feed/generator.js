const xmlbuilder = require('xmlbuilder');
const {getType} = require('mime');

const posts = require('../posts/loader');


const BASE_URL = 'https://blanktar.jp';
const LENGTH = 100;


function formatTimestamp(timestamp) {
    return new Date(timestamp).toISOString();
}


module.exports = xmlbuilder.create({
    feed: {
        '@xmlns': 'http://www.w3.org/2005/Atom',
        '@xml:lang': 'ja',
        id: 'http://blanktar.jp/blog/feed.xml',
        title: 'Blanktar - blog',
        link: [{
            '@rel': 'alternate',
            '@type': 'text/html',
            '@href': BASE_URL + '/blog/',
        }, {
            '@rel': 'self',
            '@type': 'application/atom+xml',
            '@href': BASE_URL + '/blog/feed.xml',
        }],
        author: {
            name: 'MacRat',
            email: 'm@crat.jp',
            uri: BASE_URL,
        },
        icon: BASE_URL + '/img/social-preview.png',
        logo: BASE_URL + '/img/blanktar-logo.png',
        updated: formatTimestamp(posts.slice(0, LENGTH).map(p => p.pubtime).reduce((x, y) => {
            if (x > y) {
                return x;
            } else {
                return y;
            }
        })),
        entry: posts.slice(0, LENGTH).map(p => ({
            title: p.title,
            link: [
                {
                    '@rel': 'alternate',
                    '@type': 'text/html',
                    '@href': BASE_URL + p.href,
                    '@hreflang': 'ja',
                },
                ...(typeof p.image === 'string' ? [{
                    '@rel': 'enclosure',
                    '@type': getType(p.image),
                    '@href': BASE_URL + p.image,
                }] : p.image ? (
                    p.image.map(img => ({
                        '@rel': 'enclosure',
                        '@type': getType(img),
                        '@href': BASE_URL + img,
                    }))
                ) : (
                    ['1x1', '4x3', '16x9'].map(size => ({
                        '@rel': 'enclosure',
                        '@type': 'image/png',
                        '@href': `https://blanktar.jp/img/eyecatch/${size}/${encodeURIComponent(p.title)}.png`,
                    }))
                )),
            ],
            id: BASE_URL + p.href,
            updated: p.modtime ? formatTimestamp(p.modtime) : formatTimestamp(p.pubtime),
            published: formatTimestamp(p.pubtime),
            summary: p.description,
        })),
    },
}).end();
