const fm = require('front-matter');
const fs = require('fs');


const BLOG_BASE = './pages/blog';


function testMetaData(path, { title, pubtime, modtime, amp, tags, description }) {
    let ok = true;

    if (!title) {
        console.error(`${path} "${title}" (${pubtime}): title is not provided`);
        ok = false;
    }
    if (!pubtime || !pubtime.match(/^20[0-9]{2}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):[0-5][0-9]\+0900$/)) {
        console.error(`${path} "${title}" (${pubtime}): pubtime is not provided or invalid format: "${pubtime}"`);
        ok = false;
    }
    if (modtime && !modtime.match(/^20[0-9]{2}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):[0-5][0-9]\+0900$/)) {
        console.error(`${path} "${title}" (${pubtime}): modtime is not provided or invalid format: "${modtime}"`);
        ok = false;
    }
    if (![true, false, 'hybrid'].includes(amp)) {
        console.error(`${path} "${title}" (${pubtime}): amp is not provided or invalid value: "${amp}"`);
        ok = false;
    }
    if (!tags || tags.length === 0) {
        console.error(`${path} "${title}" (${pubtime}): tags is not provided`);
        ok = false;
    }
    if (!description && description !== null) {
        console.error(`${path} "${title}" (${pubtime}): description is not provided`);
        ok = false;
    }

    return ok;
}


for (let year of fs.readdirSync(BLOG_BASE)) {
    if (!year.match(/^[0-9]{4}$/)) continue;

    for (let month of fs.readdirSync(`${BLOG_BASE}/${year}`)) {
        if (!month.match(/^0[1-9]|1[0-2]$/)) continue;

        for (let file of fs.readdirSync(`${BLOG_BASE}/${year}/${month}`)) {
            if (!file.match(/\.mdx$/)) continue;

            const path = `${BLOG_BASE}/${year}/${month}/${file}`;

            const article = fm(fs.readFileSync(path, 'utf8'));
            const meta = article.attributes;

            if (!testMetaData(`${year}/${month}/${file}`, meta)) {
                process.exitCode = 1;
            }
        }
    }
}
