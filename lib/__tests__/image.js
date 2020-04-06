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
});


describe('get image hash', () => {
    test('blanktar-logo.png', async () => {
        const hash = (await Image.read('public/img/blanktar-logo.png')).hash();

        expect(hash).toBe('9334a62bde117ba065bb70135ae51fbe');
    });

    test('macrat.png', async () => {
        const hash = (await Image.read('public/img/macrat.png')).hash();

        expect(hash).toBe('0a843275986f99b0a3646c6ba47cc7fb');
    });
});


describe('optimize', () => {
    test('jpeg', async () => {
        jest.setTimeout(60 * 1000);

        const img = await Image.read('public/blog/2018/09/raspberrypi-zero-temperature-humidity-logger.jpg');
        const optimized = await img.optimize('__test__', 320);

        expect(optimized.width).toBe(320);
        expect(optimized.height).toBe(240);

        const mdpiSize = (await Image.read(optimized.mdpi.replace(/^\/_next/, './.next'))).size;
        expect(mdpiSize.width).toBe(320);
        expect(mdpiSize.height).toBe(240);


        const hdpiSize = (await Image.read(optimized.hdpi.replace(/^\/_next/, './.next'))).size;
        expect(hdpiSize.width).toBe(640);
        expect(hdpiSize.height).toBe(480);
    });

    test('png', async () => {
        jest.setTimeout(60 * 1000);

        const img = await Image.read('public/blog/2020/01/new-year.png');
        const optimized = await img.optimize('__test__', 320);

        expect(optimized.width).toBe(320);
        expect(optimized.height).toBe(217);

        const mdpiSize = (await Image.read(optimized.mdpi.replace(/^\/_next/, './.next'))).size;
        expect(mdpiSize.width).toBe(320);
        expect(mdpiSize.height).toBe(217);


        const hdpiSize = (await Image.read(optimized.hdpi.replace(/^\/_next/, './.next'))).size;
        expect(hdpiSize.width).toBe(640);
        expect(hdpiSize.height).toBe(433);
    });
});

describe('trace', () => {
    test('jpeg', async () => {
        const img = await Image.read('public/blog/2018/09/raspberrypi-zero-temperature-humidity-logger.jpg');
        const {viewBox, path} = await img.trace();

        expect(viewBox).toBe('0 0 240 180');
        expect(path).toMatch(/^<path d=".*" stroke="none" fill="var\(--colors-img-trace\)" fill-rule="evenodd"\/>$/);
    });

    test('png', async () => {
        const img = await Image.read('public/blog/2020/01/new-year.png');
        const {viewBox, path} = await img.trace();

        expect(viewBox).toBe('0 0 240 162.25352112676057');
        expect(path).toMatch(/^<path d=".*" stroke="none" fill="var\(--colors-img-trace\)" fill-rule="evenodd"\/>$/);
    });
});
