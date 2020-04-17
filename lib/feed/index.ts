import preval from 'preval.macro';


type PreValValue = {
    feed: string;
    hash: string;
};

const {feed, hash: h}: PreValValue = preval`
    const feed = require('./generator');
    const hash = require('crypto').createHash('md5').update(feed).digest('hex');
    module.exports = {feed, hash};
`;

export const hash = h;

export default feed;
