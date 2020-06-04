import penv from 'penv.macro';
import preval from 'preval.macro';


type Snippets = {
    [keyword: string]: string;
};


const snippets = penv(
    {
        development: require('./loader') as Snippets[],
        test: require('./loader') as Snippets[],
    },
    preval`module.exports = require('./loader')` as Snippets[],
);


export default (query: string): string | undefined => {
    return snippets[query.toLowerCase()];
};
