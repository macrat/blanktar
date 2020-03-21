import preval from 'preval.macro';


const {sitemap, hash: h} = preval`
    const sitemap = require('./generator');
    const hash = require('crypto').createHash('md5').update(sitemap).digest('hex');
    module.exports = {sitemap, hash};
`;

export const hash = h;

export default sitemap;
