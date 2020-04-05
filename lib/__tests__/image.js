import Image from '../image';


describe('detect image size', () => {
    test('1024x1024.png', async () => {
        const {width, height} = (await Image.read('public/img/blanktar-logo.png')).size;

        expect(width).toBe(1024);
        expect(height).toBe(1024);
    });

    test('312x60.png', async () => {
        const {width, height} = (await Image.read('public/img/blanktar-banner.png')).size;

        expect(width).toBe(312);
        expect(height).toBe(60);
    });

    test('from online', async () => {
        const {width, height} = (await Image.read('https://blanktar.jp/macrat.png')).size;

        expect(width).toBe(256);
        expect(height).toBe(256);
    });
})
