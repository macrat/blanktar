/**
 * ブログで使用されているタグをTSV形式で出す
 */

const posts = require('../lib/posts/loader');


const tags = new Map();

for (const p of posts) {
    for (const t of p.tags) {
        if (!tags.has(t)) {
            tags.set(t, []);
        }
        tags.set(t, [...tags.get(t), p.title]);
    }
}

for (const [tag, titles] of tags) {
    for (const title of titles) {
        console.log([titles.length, tag, title].join('\t'));
    }
}
