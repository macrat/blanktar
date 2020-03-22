import eyecatch from '../../../pages/api/eyecatch/[title].ts';


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
                setHeader(name: string, value: string) {
                    headers[name] = value;
                    return this;
                },
                send(data: Buffer) {
                    return this;
                },
            });

            expect(headers['Content-Type']).toBe('image/png');
        });
    });
});
