const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});


const withMdxEnhanced = require('next-mdx-enhanced')({
    defaultLayout: true,
    exportFrontmatterAs: 'config',
});


module.exports = withBundleAnalyzer(withMdxEnhanced({
    pageExtensions: ['ts', 'tsx', 'mdx'],
}));
