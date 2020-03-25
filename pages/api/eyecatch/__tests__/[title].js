import eyecatch from '../[title]';


describe("don't crash", () => {
    [
        ['short ascii', 'hello'],
        ['long ascii', 'hello world '.repeat(30)],
        ['short japanese', 'テスト'],
        ['long japanese', 'テスト '.repeat(30)],
    ].forEach(([name, title]) => {
        test(name, async () => {
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

            expect(headers['Content-Type']).toBe('image/png');
        });
    });
});
