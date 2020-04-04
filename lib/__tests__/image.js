import {detectSize} from '../image';


describe('detect image size', () => {
    test('1024x1024.png', async () => {
        const {width, height} = await detectSize('public/img/blanktar-logo.png');

        expect(width).toBe(1024);
        expect(height).toBe(1024);
    });

    test('312x60.png', async () => {
        const {width, height} = await detectSize('public/img/blanktar-banner.png');

        expect(width).toBe(312);
        expect(height).toBe(60);
    });

    test('312x60.svg', async () => {
        const {width, height} = await detectSize('public/img/blanktar-banner.svg');

        expect(width).toBe(312);
        expect(height).toBe(60);
    });

    test('from online', async () => {
        const {width, height} = await detectSize('https://blanktar.jp/macrat.png');

        expect(width).toBe(256);
        expect(height).toBe(256);
    });
})
