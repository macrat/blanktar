import Benchmark from 'asyncmark';

import eyecatch from '../[title]';


const execute = async (title) => {
    const headers = {};

    await eyecatch({
        headers: {},
        query: {
            title: title,
        },
    }, {
        setHeader(name, value) {
            headers[name] = value;
            return this;
        },
        send(data) {
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
