import preval from 'preval.macro';
import penv from 'penv.macro';

import { Post as P } from './types';


export type Post = P;


/* eslint-disable @typescript-eslint/no-var-requires */
export default penv(
    {
        development: require('./loader') as Post[],
        test: require('./loader') as Post[],
    },
    preval`module.exports = require('./loader')` as Post[],
);


export const hash = penv(
    {
        development: require('./loader').hash as string,
        test: require('./loader').hash as string,
    },
    preval`module.exports = require('./loader').ash` as string,
);
/* eslint-enable @typescript-eslint/no-var-requires */
