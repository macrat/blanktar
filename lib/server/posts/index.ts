import preval from 'preval.macro';

import {Post as P} from './types';


export type Post = P;

export default (preval`module.exports = require('./loader')` as Post[]).map(x => ({
    ...x,
    pubtime: new Date(x.pubtime),
    modtime: x.modtime ? new Date(x.modtime) : undefined,
}));
