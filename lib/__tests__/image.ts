import { promises as fs } from 'fs';
import fetchMock from 'jest-fetch-mock';

import Image from '../image';


beforeEach(async () => {
    await fs.rmdir('./.next/static/__test__', { recursive: true }).catch(() => null);
});


describe('detect image size', () => {
    beforeEach(async () => {
        fetchMock.enableMocks();

        fetchMock.mockResponse(await fs.readFile('./assets/eyecatch-base-4x3.svg', 'utf8'));
    });

    afterEach(() => {
        fetchMock.disableMocks();
    });

    test('1024x1024.png', async () => {
        const { width, height } = await (new Image('public/img/blanktar-logo@1024.png')).size();

        expect(width).toBe(1024);
        expect(height).toBe(1024);
    });

    test('312x60.png', async () => {
        const { width, height } = await (new Image('public/img/blanktar-banner.png')).size();

        expect(width).toBe(312);
        expect(height).toBe(60);
    });

    test('from online', async () => {
        const { width, height } = await (await Image.download('http://example.com/foo/bar.svg')).size();

        expect(width).toBe(1200);
        expect(height).toBe(900);
    });
});


describe('trace', () => {
    test('jpeg', async () => {
        const img = new Image('public/blog/2018/09/raspberrypi-zero-temperature-humidity-logger.jpg');
        const { viewBox, path } = await img.trace();

        expect(viewBox).toBe('0 0 240 180');
        expect(path).toMatch(/^<path d=".*" stroke="none" fill="var\(--colors-img-trace\)" fill-rule="evenodd"\/>$/);
    });

    test('png', async () => {
        const img = new Image('public/blog/2020/01/new-year.png');
        const { viewBox, path } = await img.trace();

        expect(viewBox).toBe('0 0 240 162');
        expect(path).toMatch(/^<path d=".*" stroke="none" fill="var\(--colors-img-trace\)" fill-rule="evenodd"\/>$/);
    });
});
