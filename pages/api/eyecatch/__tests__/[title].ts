import Benchmark from 'asyncmark';

import eyecatch from '../[title]';


const execute = async (title: string) => {
    const headers: {[key: string]: string} = {};

    await eyecatch({
        headers: {},
        query: {
            title: title,
        },
    }, {
        setHeader(name: string, value: string) {
            headers[name] = value;
            return this;
        },
        send(data: any) {
            return this;
        },
    });

    return {headers};
}


describe("don't crash", () => {
    [
        ['short ascii', 'hello'],
        ['long ascii', 'hello world '.repeat(30)],
        ['short japanese', 'テスト'],
        ['long japanese', 'テスト '.repeat(30)],
    ].forEach(([name, title]) => {
        test(name, async () => {
            const {headers} = await execute(title);

            expect(headers['Content-Type']).toBe('image/png');
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
