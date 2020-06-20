import penv from 'penv.macro';
import preval from 'preval.macro';


export type Snippet = {
    html: string;
    summary: string;
};


type SnippetDict = {
    [keyword: string]: Snippet;
};


/* eslint-disable @typescript-eslint/no-var-requires */
const snippets: SnippetDict = penv(
    {
        development: require('./loader') as SnippetDict,
        test: require('./loader') as SnippetDict,
    },
    preval`module.exports = require('./loader')` as SnippetDict,
);
/* eslint-enable @typescript-eslint/no-var-requires */


export default (query: string): Snippet | undefined => {
    return snippets[query.trim().toLowerCase()];
};
