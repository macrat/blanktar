export function getImageURL(title?: string, image?: string | string[]): string {
    if (typeof image === 'string') {
        return `https://blanktar.jp${image}`;
    } else if (image) {
        return `https://blanktar.jp${image[0]}`;
    }
    if (title) {
        return `https://blanktar.jp/img/eyecatch/1x1/${encodeURIComponent(title)}.png`;
    }
    return 'https://blanktar.jp/img/social-preview.png';
}
