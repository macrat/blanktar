import penv from 'penv.macro';
import preval from 'preval.macro';


type Snippets = {
    [keyword: string]: string;
};


// eslint-disable @typescript-eslint/no-var-requires
const snippets: Snippets = penv(
    {
        development: require('./loader') as Snippets,
        test: require('./loader') as Snippets,
    },
    preval`module.exports = require('./loader')` as Snippets,
);
// eslint-enable @typescript-eslint/no-var-requires


export default (query: string): string | undefined => {
    return snippets[query.toLowerCase()];
};
