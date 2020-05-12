import {Request, Response} from '~/lib/api/testutil';
import fetchMock from 'jest-fetch-mock';

import font from '../font';


const TEST_CSS = '// this is a test css';


beforeEach(() => {
    fetchMock.enableMocks();

    fetchMock.mockResponse(TEST_CSS);
});


afterEach(() => {
    fetchMock.disableMocks();
});


test('mock test', async () => {
    const res = await fetch('http://localhost/some/path');

    expect(res.ok).toBe(true);
    expect(await res.text()).toBe(TEST_CSS);
});


test('fetch by google', async () => {
    const req = new Request();

    const res = new Response({
        onEnd() {
            expect(res.getHeader('Content-Type')).toBe('text/css; charset=utf-8');
            expect(res.getHeader('Link')).toBe('<https://fonts.gstatic.com>; rel=preconnect; crossorigin');
            expect(res.statusCode).toBe(200);
            expect(res.getBody()).toBe(TEST_CSS);
        },
    });

    await font(req, res);
    res.end();
});
