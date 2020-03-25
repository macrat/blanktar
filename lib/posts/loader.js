const fm = require('front-matter');
const fs = require('fs');
const crypto = require('crypto');


const BLOG_BASE = './pages/blog';


const asJST = time => {
    const offset = -9;

    return new Date(time - (offset * 60 - time.getTimezoneOffset()) * 60 * 1000);
};


const posts = [];

for (let year of fs.readdirSync(BLOG_BASE)) {
    if (!year.match(/^[0-9]{4}$/)) continue;

    for (let month of fs.readdirSync(`${BLOG_BASE}/${year}`)) {
        if (!month.match(/^0[1-9]|1[0-2]$/)) continue;

        for (let file of fs.readdirSync(`${BLOG_BASE}/${year}/${month}`)) {
            if (!file.match(/\.mdx$/)) continue;

            const path = `${BLOG_BASE}/${year}/${month}/${file}`;

            const article = fm(fs.readFileSync(path, 'utf8'));
            const meta = article.attributes;

            const pubtime = asJST(new Date(meta.pubtime));
            const modtime = asJST(new Date(meta.modtime));

            posts.push({
                ...meta,
                lowerTitle: meta.title.toLowerCase(),
                lowerTags: meta.tags.map(x => x.toLowerCase()),
                year: pubtime.getFullYear(),
                month: pubtime.getMonth() + 1,
                pubtime: pubtime,
                modtime: modtime,
                href: `/blog${path.slice(BLOG_BASE.length, -'.mdx'.length)}`,
                content: article.body,
                lowerContent: article.body.toLowerCase(),
            });
        }
    }
}

posts.sort((x, y) => {
    if (x.pubtime > y.pubtime) return -1;
    if (x.pubtime < y.pubtime) return 1;
    return 0;
});


module.exports = posts;


module.exports.hash = (
    crypto
        .createHash('md5')
        .update(JSON.stringify(posts))
        .digest('hex')
);
