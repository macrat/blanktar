import font from '../font';


test('fetch by google', async () => {
    const headers: {[key: string]: string} = {};

    await font({
        headers: {},
    }, {
        setHeader(name: string, value: string) {
            headers[name] = value;
            return this;
        },
        status() {
            return this;
        },
        send() {
            return this;
        },
    });

    expect(headers['Content-Type']).toBe('text/css; charset=utf-8');
    expect(headers['Link']).toBe('<https://fonts.gstatic.com>; rel=preconnect; crossorigin');
});
