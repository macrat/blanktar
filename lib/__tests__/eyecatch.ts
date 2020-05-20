import {getImageURL} from '../eyecatch';


describe('getImageURL', () => {
    const tests: [string, string | undefined, string | string[] | undefined, string][] = [
        ['with single custom image', 'some title', '/path/to/image.jpg', 'https://blanktar.jp/path/to/image.jpg'],
        ['with multi custom image', 'some title', ['/A.jpg', '/B.jpg'], 'https://blanktar.jp/A.jpg'],
        ['with title', 'some title', undefined, 'https://blanktar.jp/img/eyecatch/1x1/some%20title.png'],
        ['without params', undefined, undefined, 'https://blanktar.jp/img/social-preview.png'],
    ];

    test.each(tests)('%s', (_, title, image, expect_) => {
        expect(getImageURL(title, image)).toBe(expect_);
    });
});
