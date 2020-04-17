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
        status(code: number) {
            return this;
        },
        send(value: any) {
            return this;
        },
    })

    expect(headers['Content-Type']).toBe('text/css; charset=utf-8');
    expect(headers['Link']).toBe('<https://fonts.gstatic.com>; rel=preconnect; crossorigin');
});
