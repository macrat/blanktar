import Benchmark from 'asyncmark';

import {Request, Response} from '~/lib/api/testutil';

import eyecatch from '../[title]';


const execute = async (title: string) => {
    const req = new Request({
        query: {
            title: title,
        },
    });

    const res = new Response();

    await eyecatch(req, res);
    res.end();

    return res;
};


describe("don't crash", () => {
    [
        ['short ascii', 'hello'],
        ['long ascii', 'hello world '.repeat(30)],
        ['short japanese', 'テスト'],
        ['long japanese', 'テスト '.repeat(30)],
    ].forEach(([name, title]) => {
        test(name, async () => {
            const res = await execute(title);

            expect(res.statusCode).toBe(200);
            expect(res.getHeader('Content-Type')).toBe('image/png');
        });
    });
});


test('benchmark', async () => {
    const result = await new Benchmark({
        name: 'eyecatch',
        number: 5,
        async fun() {
            await execute('this is a test');
        },
    }).run();

    result.assert('<200ms');
});
