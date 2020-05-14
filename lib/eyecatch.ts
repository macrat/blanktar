export function getImageURL(title: string, image?: string): string {
    if (image) {
        return `https://blanktar.jp${image}`;
    }
    if (title) {
        return `https://blanktar.jp/img/eyecatch/1x1/${encodeURIComponent(title)}.png`;
    }
    return 'https://blanktar.jp/img/social-preview.png';
}
