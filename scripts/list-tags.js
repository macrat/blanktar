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
        tags.set(t, [...tags.get(t), p]);
    }
}

for (const [tag, ps] of tags) {
    for (const post of ps) {
        console.log([ps.length, tag, new Date(post.pubtime).toLocaleString(), post.title].join('\t'));
    }
}
