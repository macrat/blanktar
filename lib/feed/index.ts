import preval from 'preval.macro';


const {feed, hash: h}: {feed: string, hash: string} = preval`
    const feed = require('./generator');
    const hash = require('crypto').createHash('md5').update(feed).digest('hex');
    module.exports = {feed, hash};
`;

export const hash = h;

export default feed;
