const isDebug = process.env.NODE_ENV === 'development';


const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});


const withMdxEnhanced = require('next-mdx-enhanced')({
    defaultLayout: true,
    exportFrontmatterAs: 'config',
});


const CSPHeader = [
    "default-src 'self'",
    "img-src 'self' data:",
    "style-src-elem 'self' 'unsafe-inline' blob:",
    ...(isDebug ? [
        "style-src-attr 'self' 'unsafe-inline'",
        "script-src-elem 'self' 'unsafe-inline'",
    ] : []),
    "font-src https://fonts.gstatic.com/",
    "frame-ancestors 'none'",
    "report-uri /api/csp-report",
].join('; ');


module.exports = withBundleAnalyzer(withMdxEnhanced({
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'mdx'],
    webpack(config, options) {
        config.resolve.alias['~'] = __dirname;
        return config;
    },
    experimental: {
        headers: () => [{
            source: '/(.*)',
            headers: [
                {key: 'X-XSS-Protection', value: '1; mode=block'},
                {key: 'X-Content-Type-Options', value: 'nosniff'},
                {key: 'X-Frame-Options', value: 'deny'},
                {key: 'Referrer-Policy', value: 'no-referrer-when-downgrade'},
                {
                    key: isDebug ? (
                        'Content-Security-Policy-Report-Only'
                    ) : (
                        'Content-Security-Policy'
                    ),
                    value: CSPHeader,
                },
            ],
        }],
        rewrites: () => [
            {source: '/img/eyecatch/:title.png', destination: '/api/eyecatch/:title'},
            {source: '/font.css', destination: '/api/font'},
            {source: '/sitemap.xml', destination: '/api/sitemap'},
            {source: '/blog/feed.xml', destination: '/api/feed'},
        ],
    },
}));
