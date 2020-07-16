import { createHash } from 'crypto';
import { promises as fs } from 'fs';

import fetch from 'node-fetch';
import CleanCSS from 'clean-css';


interface FontInfo {
    original: string;
    path: string;
    href: string;
}


function parseCSS(css: string): FontInfo[] {
    return [...css.matchAll(/https:\/\/[^")]+/g)].map(([original]) => {
        if (!original) {
            throw new Error('failed to match URL');
        }

        const hash = createHash('md5').update(original).digest('hex').slice(0, 12);
        const ext = original.match(/(?<=\.)[a-z0-9]+$/);

        if (!ext) {
            throw new Error(`extension is not found: ${original}`);
        }

        return {
            original,
            path: `../public/font/${hash}.${ext[0]}`,
            href: `/font/${hash}.${ext[0]}`,
        };
    });
}


function convertCSS(css: string, fonts: FontInfo[]): string {
    fonts.forEach(({ original, href }) => {
        css = css.replace(original, href);
    });
    return css;
}


async function downloadFonts(fonts: FontInfo[]): Promise<void> {
    await Promise.all(fonts.map(async ({ original, path }) => {
        const resp = await fetch(original);

        if (!resp.ok) {
            throw new Error(`failed to fetch font: ${original}`);
        }

        await fs.writeFile(path, Buffer.from(await resp.arrayBuffer()));
        console.log(path);
    }));
}


async function downloadCSS(): Promise<string> {
    const resp = await fetch(
        'https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese',
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
            },
        },
    );

    if (!resp.ok) {
        throw new Error('failed to fetch style sheet');
    }

    return await resp.text();
}


(async () => {
    const originalCSS = await downloadCSS();
    const fonts = parseCSS(originalCSS);

    await fs.mkdir('../public/font', { recursive: true });

    await downloadFonts(fonts);

    const convertedCSS = new CleanCSS().minify(convertCSS(originalCSS, fonts)).styles;
    await fs.writeFile('../public/font/font.css', Buffer.from(convertedCSS));
    console.log('../public/font/font.css');
})();
