const { promises: fs } = require('fs');

const { parseCSS, convertCSS, downloadFonts } = require('../loader');


const style = `
    @font-face {
        font-family: "foobar";
        unicode-range: U+0-4F;
        src: url("https://example.com/path/to/font1.woff2");
    }
    @font-face {
        font-family: "foobar";
        unicode-range: U+50-7F;
        src: url(https://example.com/path/to/font2.woff2);
    }
`;

const fonts = [
    {
        original: 'https://example.com/path/to/font1.woff2',
        path: './.next/static/font/6c352056db9b.woff2',
        href: '/_next/static/font/6c352056db9b.woff2',
    },
    {
        original: 'https://example.com/path/to/font2.woff2',
        path: './.next/static/font/39e1c15215ab.woff2',
        href: '/_next/static/font/39e1c15215ab.woff2',
    },
];


beforeEach(async () => {
    await fs.rmdir('./.next/static/__test__', { recursive: true }).catch(() => null);
});


describe('font loader', () => {
    test('makeURLSet', () => {
        expect(parseCSS(style)).toEqual(fonts);
    });

    test('convertCSS', () => {
        expect(convertCSS(style, fonts)).toEqual(`
    @font-face {
        font-family: "foobar";
        unicode-range: U+0-4F;
        src: url("/_next/static/font/6c352056db9b.woff2");
    }
    @font-face {
        font-family: "foobar";
        unicode-range: U+50-7F;
        src: url(/_next/static/font/39e1c15215ab.woff2);
    }
`);
    });

    test('downloadFonts', async () => {
        downloadFonts([{
            original: 'https://blanktar.jp',
            path: './.next/static/__test__/font/test',
            href: '/_next/static/__test__/font/test',
        }]);

        expect(await fs.readFile('./.next/static/__test__/font/test', 'utf8')).toMatch(/<title>Blanktar<\/title>/);
    });
});
