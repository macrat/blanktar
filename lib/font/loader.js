const { createHash } = require('crypto');
const { promises: fs } = require('fs');


module.exports = {
    parseCSS(css) {
        return [...css.matchAll(/https:\/\/[^")]+/g)].map((m) => {
            const original = m[0];
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
        for (const f of fonts) {
            css = css.replace(f.original, f.href);
        }
        return css;
    },

    async downloadFonts(fonts) {
        await Promise.all(fonts.map(async (font) => {
            const resp = await fetch(font.original);

            await fs.mkdir(font.path.match(/.*(?=\/.*)/)[0], { recursive: true }).catch(() => null);

            if (!resp.ok) {
                throw new Error(`failed to fetch font: ${font.original}`);
            }

            await fs.writeFile(font.path, Buffer.from(await resp.arrayBuffer()));
        }));
    },

    async load() {
        const resp = await fetch('https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
            },
        });

        if (!resp.ok) {
            throw new Error('failed to fetch style sheet');
        }

        const originalCSS = await resp.text();
        const fonts = this.parseCSS(originalCSS);
        const convertedCSS = this.convertCSS(originalCSS, fonts);

        await fs.mkdir('./.next/static/font', { recursive: true }).catch(() => null);
        const hash = createHash('md5').update(convertedCSS).digest('hex').slice(0, 12);
        await fs.writeFile(`./.next/static/font/${hash}.css`, convertedCSS);

        return `/_next/static/font/${hash}.css`;
    },
};
