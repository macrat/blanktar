const isDebug = process.env.NODE_ENV === 'development';


const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});


const withOffline = config => {
    return require('next-offline')({
        ...config,
        generateInDevMode: true,
        workboxOpts: {
            swDest: 'static/service-worker.js',
        },
    });
};


const withMdxEnhanced = require('next-mdx-enhanced')({
    defaultLayout: true,
    exportFrontmatterAs: 'config',
});


const CSPHeader = [
    "default-src 'self'",
    "style-src-elem 'self' 'unsafe-inline' blob: https://fonts.googleapis.com/css",
    ...(isDebug ? [
        "img-src 'self' data: www.google-analytics.com",
        "style-src-attr 'self' 'unsafe-inline'",
        "script-src-elem 'self' 'unsafe-inline' https://cdn.ampproject.org/ https://www.google-analytics.com/analytics_debug.js",
    ] : [
        "img-src 'self' data: https://www.google-analytics.com",
        "script-src-elem 'self' https://cdn.ampproject.org/ https://www.google-analytics.com/analytics.js",
    ]),
    "font-src https://fonts.gstatic.com/s/notosansjp/",
    "frame-ancestors 'none'",
    "report-uri /api/csp-report",
].join('; ');


module.exports = withBundleAnalyzer(withOffline(withMdxEnhanced({
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'mdx'],
    webpack(config, options) {
        config.resolve.alias['~'] = __dirname;
        config.module.rules.push({
            test: /\.svg$/i,
            use: [{
                loader: 'raw-loader',
                options: {esModule: false},
            }],
        });
        return config;
    },
    env: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN,
        INSTAGRAM_TOKEN: process.env.INSTAGRAM_TOKEN,
        GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
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
            {source: '/service-worker.js', destination: '/_next/static/service-worker.js'},
        ],
    },
})));
