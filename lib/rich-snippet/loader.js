const fs = require('fs');


const SNIPPETS_BASE = './lib/rich-snippet';


const snippets = {};

for (let fname of fs.readdirSync(SNIPPETS_BASE)) {
    if (!fname.endsWith('.md')) continue;

    snippets[fname.slice(0, -3).toLowerCase()] = fs.readFileSync(`${SNIPPETS_BASE}/${fname}`, 'utf8');
}

module.exports = snippets;
