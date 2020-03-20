const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});


const withMdxEnhanced = require('next-mdx-enhanced')({
    defaultLayout: true,
    exportFrontmatterAs: 'config',
});


module.exports = withBundleAnalyzer(withMdxEnhanced({
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'mdx'],
    experimental: {
        rewrites: () => [
            {source: '/img/eyecatch/:title.png', destination: '/api/eyecatch/:title'},
            {source: '/font.css', destination: '/api/font'},
            {source: '/sitemap.xml', destination: '/api/sitemap'},
            {source: '/blog/feed.xml', destination: '/api/feed'},
        ],
    },
}));
