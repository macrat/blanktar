import {Request, Response} from '../testutil';

import withCache from '../cache';


test('hit', async () => {
    const req = new Request({
        headers: {'if-none-match': '"test"'},
    });

    const res = new Response({
        onEnd() {
            expect(res.getHeader('ETag')).toBe('"test"');
            expect(res.getHeader('Cache-Control')).toBe('public, max-age=123');
            expect(res.statusCode).toBe(304);
        },
    });

    const handler = withCache(() => {
        throw new Error("don't call me!");
    }, {
        etag: '"test"',
        control: 'public, max-age=123',
    });

    await handler(req, res);
    res.end();
});


test('miss', async () => {
    const req = new Request({
        headers: {'if-none-match': '"test2"'},
    });

    const res = new Response({
        onEnd() {
            expect(called).toBe(true);
            expect(res.getHeader('ETag')).toBe('"test"');
            expect(res.getHeader('Cache-Control')).toBe('public, max-age=123');
            expect(res.statusCode).toBe(200);
        },
    });

    let called = false;

    const handler = withCache(() => {
        called = true;
    }, {
        etag: '"test"',
        control: 'public, max-age=123',
    });

    await handler(req, res);
    res.end();
});
