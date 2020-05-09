import Benchmark from 'asyncmark';
import {NextApiHandler} from 'next';

import {Request, Response} from '~/lib/api/testutil';

import eyecatch from '../eyecatch';


const execute = async (title: string, func: NextApiHandler) => {
    const req = new Request({
        query: {
            title: title,
        },
    });

    const res = new Response();

    await func(req, res);
    res.end();

    return res;
};


describe("don't crash", () => {
    [
        /* eslint-disable @typescript-eslint/no-var-requires */
        {name: '1x1',  func: eyecatch(require('~/assets/eyecatch-base-1x1.svg'), 1200, 1200)},
        {name: '16x9', func: eyecatch(require('~/assets/eyecatch-base-16x9.svg'), 1200, 675)},
        /* eslint-enable @typescript-eslint/no-var-requires */
    ].forEach(({name, func}) => {
        describe(name, () => {
            [
                ['short ascii', 'hello'],
                ['long ascii', 'hello world '.repeat(30)],
                ['short japanese', 'テスト'],
                ['long japanese', 'テスト '.repeat(30)],
            ].forEach(([name, title]) => {
                test(name, async () => {
                    const res = await execute(title, func);

                    expect(res.statusCode).toBe(200);
                    expect(res.getHeader('Content-Type')).toBe('image/png');
                });
            });
        });
    });
});


test('benchmark', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const func = eyecatch(require('~/assets/eyecatch-base-1x1.svg'), 1200, 1200);

    const result = await new Benchmark({
        name: 'eyecatch',
        number: 5,
        async fun() {
            await execute('this is a test', func);
        },
    }).run();

    result.assert('<200ms');
});
