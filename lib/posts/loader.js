const fm = require('front-matter');
const fs = require('fs');
const crypto = require('crypto');


const BLOG_BASE = './pages/blog';
const TIMEZONE_OFFSET = 9 * 60 * 60 * 1000;


const posts = [];

for (let year of fs.readdirSync(BLOG_BASE)) {
    if (!year.match(/^[0-9]{4}$/)) continue;

    for (let month of fs.readdirSync(`${BLOG_BASE}/${year}`)) {
        if (!month.match(/^(0[1-9]|1[0-2])$/)) continue;

        for (let file of fs.readdirSync(`${BLOG_BASE}/${year}/${month}`)) {
            if (!file.match(/\.mdx$/)) continue;

            const path = `${BLOG_BASE}/${year}/${month}/${file}`;

            const article = fm(fs.readFileSync(path, 'utf8'));
            const meta = article.attributes;

            const pubtime = new Date(meta.pubtime);
            const pubtime_local = new Date(pubtime.getTime() + TIMEZONE_OFFSET);

            posts.push({
                title: meta.title,
                lowerTitle: meta.title.toLowerCase(),
                year: pubtime_local.getUTCFullYear(),
                month: pubtime_local.getUTCMonth() + 1,
                pubtime: pubtime.getTime(),
                modtime: new Date(meta.modtime).getTime(),
                tags: meta.tags,
                lowerTags: meta.tags.map(x => x.toLowerCase()),
                image: meta.image,
                description: meta.description,
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
