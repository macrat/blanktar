const { createHash } = require('crypto');
const fs = require('fs');

const request = require('sync-request');
const CleanCSS = require('clean-css');


module.exports = {
    parseCSS(css) {
        return [...css.match(/https:\/\/[^")]+/g)].map((original) => {
            const hash = createHash('md5').update(original).digest('hex').slice(0, 12);
            const ext = original.match(/(?<=\.)[a-z0-9]+$/);

            if (!ext) {
                throw new Error(`extension is not found: ${original}`);
            }

            return {
                original,
                path: `./.next/static/font/${hash}.${ext[0]}`,
                href: `/_next/static/font/${hash}.${ext[0]}`,
            };
        });
    },

    convertCSS(css, fonts) {
        fonts.forEach(({ original, href }) => {
            css = css.replace(original, href);
        });
        return css;
    },

    downloadFonts(fonts) {
        fonts.forEach(({ original, path }) => {
            const resp = request('GET', original);

            fs.mkdirSync(path.match(/.*(?=\/.*)/)[0], { recursive: true });

            if (!resp.statusCode >= 300 || resp.body === undefined) {
                throw new Error(`failed to fetch font: ${original}`);
            }

            fs.writeFileSync(path, resp.body);
        });
    },

    load() {
        const resp = request(
            'GET',
            'https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese',
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
                },
            },
        );

        if (!resp.statusCode >= 300 || resp.body === undefined) {
            throw new Error('failed to fetch style sheet');
        }

        const originalCSS = resp.body.toString('utf8');
        const fonts = this.parseCSS(originalCSS);
        const convertedCSS = new CleanCSS().minify(this.convertCSS(originalCSS, fonts));

        this.downloadFonts(fonts);

        fs.mkdirSync('./.next/static/font', { recursive: true });
        const hash = createHash('md5').update(convertedCSS).digest('hex').slice(0, 12);
        fs.writeFileSync(`./.next/static/font/${hash}.css`, convertedCSS);

        return `/_next/static/font/${hash}.css`;
    },
};
