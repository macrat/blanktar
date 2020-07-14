import { createHash } from 'crypto';
import { promises as fs } from 'fs';

type FontInfo = {
    original: string;
    path: string;
    href: string;
};

export function parseCSS(css: string): FontInfo[] {
    return [...css.matchAll(/https:\/\/[^"]+/g)].map((m) => {
        const original = m[0];
        const hash = createHash('md5').update(original).digest('hex').slice(0, 12);
        const ext = original.match(/(?<=\.)[a-z0-9]+$/)?.[0];

        return {
            original,
            path: `./.next/static/font/${hash}.${ext}`,
            href: `/_next/static/font/${hash}.${ext}`,
        };
    });
}

export function convertCSS(css: string, fonts: FontInfo[]) {
    for (const f of fonts) {
        css = css.replace(f.original, f.href);
    }
    return css;
}

export async function downloadFonts(fonts: FontInfo[]): Promise<void> {
    await Promise.all(fonts.map(async (font) => {
        const resp = await fetch(font.original);

        await fs.mkdir(font.path.match(/.*(?=\/.*)/)![0], { recursive: true }).catch(() => null);

        if (!resp.ok) {
            throw new Error(`failed to fetch font: ${font.original}`);
        }

        await fs.writeFile(font.path, Buffer.from(await resp.arrayBuffer()));
    }));
}

export default async async () => {
    const resp = await fetch('https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
        },
    });

    if (!resp.ok) {
        throw new Error('failed to fetch style sheet');
    }

    const originalCSS = await resp.text();
    const fonts = parseCSS(originalCSS);
    const convertedCSS = convertCSS(originalCSS, fonts);

    await fs.mkdir('./.next/static/font', { recursive: true }).catch(() => null);
    const hash = createHash('md5').update(convertedCSS).digest('hex').slice(0, 12);
    const cssPath = `./.next/static/font/${hash}.css`;
    await fs.writeFile(cssPath, convertedCSS);

    return cssPath;
};
