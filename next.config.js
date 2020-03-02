const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});


const withMdxEnhanced = require('next-mdx-enhanced')({
    defaultLayout: true,
    pageConfig: {
        amp: 'hybrid',
    },
});


module.exports = withBundleAnalyzer(withMdxEnhanced({
    pageExtensions: ['ts', 'tsx', 'mdx'],
}));
