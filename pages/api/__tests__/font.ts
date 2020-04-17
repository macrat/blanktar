import font from '../font';


test('fetch by google', async () => {
    const headers = {};

    await font({
        headers: {},
    }, {
        setHeader(name, value) {
            headers[name] = value;
            return this;
        },
        status(code) {
            return this;
        },
        send(value) {
            return this;
        },
    })

    expect(headers['Content-Type']).toBe('text/css; charset=utf-8');
    expect(headers['Link']).toBe('<https://fonts.gstatic.com>; rel=preconnect; crossorigin');
});
