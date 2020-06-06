const fs = require('fs');
const marked = require('marked');
const removeMD = require('remove-markdown');


const SNIPPETS_BASE = './lib/rich-snippet';


const snippets = {};

for (let fname of fs.readdirSync(SNIPPETS_BASE)) {
    if (!fname.endsWith('.md')) continue;

    const markdown = fs.readFileSync(`${SNIPPETS_BASE}/${fname}`, 'utf8');
    snippets[fname.slice(0, -3).toLowerCase()] = {
        html: marked(markdown),
        summary: removeMD(markdown).split('\n\n')[0],
    };
}

module.exports = snippets;
