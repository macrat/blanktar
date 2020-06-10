const fs = require('fs');
const marked = require('marked');


const SNIPPETS_BASE = './lib/rich-snippet';


const simpleRenderer = new marked.Renderer();
simpleRenderer.paragraph = (text) => text;


const snippets = {};

for (let fname of fs.readdirSync(SNIPPETS_BASE)) {
    if (!fname.endsWith('.md')) continue;

    const markdown = fs.readFileSync(`${SNIPPETS_BASE}/${fname}`, 'utf8');
    snippets[fname.slice(0, -3).toLowerCase()] = {
        html: marked(markdown, { headerIds: false }),
        summary: marked(markdown.split('\n\n')[0].trim(), {
            baseUrl: 'https://blanktar.jp',
            headerIds: false,
            renderer: simpleRenderer,
        }),
    };
}

module.exports = snippets;
