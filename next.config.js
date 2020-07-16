const isDebug = process.env.NODE_ENV === 'development';


const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});


const withOffline = config => {
    return require('next-offline')({
        ...config,
        generateInDevMode: false,
        workboxOpts: {
            swDest: 'static/service-worker.js',
            runtimeCaching: [{
                urlPattern: /\.(webp|png|jpg|gif|bmp|svg|mp4)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'media',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 14 * 24 * 60 * 60,
                    },
                },
            }, {
                urlPattern: /(\/_next\/static\/|\/font\/)/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'static',
                    expiration: {
                        maxEntries: 500,
                        maxAgeSeconds: 30 * 24 * 60 * 60,
                    },
                },
            }, {
                urlPattern: /\/blog\/[0-9]{4}\/[0-9]{2}\//,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'article',
                    expiration: {
                        maxEntries: 500,
                        maxAgeSeconds: 7 * 24 * 60 * 60,
                    },
                },
            }, {
                urlPattern: /\/(blog|about|works|photos)/,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'content',
                    expiration: {
                        maxAgeSeconds: 1 * 24 * 60 * 60,
                    },
                },
            }, {
                urlPattern: /\//,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'toppage',
                    expiration: {
                        maxAgeSeconds: 7 * 24 * 60 * 60,
                    },
                },
            }],
        },
    });
};


const withMdxEnhanced = require('next-mdx-enhanced')({
    defaultLayout: true,
    exportFrontmatterAs: 'config',
});


const CSPHeader = [
    "default-src 'self'",
    "style-src 'self' 'unsafe-inline' blob: https://fonts.googleapis.com/css https://*.twitter.com/",
    "img-src 'self' data: https://www.google-analytics.com https://stats.g.doubleclick.net https://*.twitter.com/ https://*.twimg.com/",
    "script-src 'self' https://cdn.ampproject.org/ https://www.google-analytics.com/analytics.js https://platform.twitter.com/ https://cdn.syndication.twimg.com/",
    "font-src 'self' https://fonts.gstatic.com/s/notosansjp/",
    "connect-src 'self' https://fonts.gstatic.com/s/notosansjp/ https://www.google-analytics.com https://www.googletagmanager.com https://cdn.ampproject.org",
    "frame-src https://platform.twitter.com/ https://syndication.twitter.com/",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "report-uri /api/csp-report",
].join('; ');


module.exports = withBundleAnalyzer(withOffline(withMdxEnhanced({
    reactStrictMode: true,
    pageExtensions: ['ts', 'tsx', 'mdx'],
    webpack(config, options) {
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
                ...(
                    isDebug ? [
                    ] : [
                        {key: 'Content-Security-Policy', value: CSPHeader}
                    ]
                ),
            ],
        }],
        rewrites: () => [
            {source: '/img/eyecatch/:size/:title.png', destination: '/api/eyecatch/:size/:title'},
            {source: '/sitemap.xml', destination: '/api/sitemap'},
            {source: '/blog/feed.xml', destination: '/api/feed'},
            {source: '/service-worker.js', destination: '/_next/static/service-worker.js'},
        ],
        redirects: () => [
            {source: '/img/eyecatch/:title.png', destination: '/img/eyecatch/1x1/:title.png', permanent: true},
        ],
    },
})));
