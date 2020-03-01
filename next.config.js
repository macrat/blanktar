const withMdxEnhanced = require('next-mdx-enhanced')({
    fileExtensions: ['mdx'],
    defaultLayout: true,
});


module.exports = withMdxEnhanced({
    pageExtensions: ['ts', 'tsx', 'mdx'],
});
