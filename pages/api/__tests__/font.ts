import {Request, Response} from '~/lib/api/testutil';

import font from '../font';


test('fetch by google', async () => {
    const req = new Request();

    const res = new Response({
        onEnd() {
            expect(res.getHeader('Content-Type')).toBe('text/css; charset=utf-8');
            expect(res.getHeader('Link')).toBe('<https://fonts.gstatic.com>; rel=preconnect; crossorigin');
            expect(res.statusCode).toBe(200);
        },
    });

    await font(req, res);
    res.end();
});
