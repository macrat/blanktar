import preval from 'preval.macro';
import penv from 'penv.macro';

import {Post as P} from './types';


export type Post = P;

export default penv(
    {development: require('./loader') as Post[]},
    preval`module.exports = require('./loader')` as Post[],
);
