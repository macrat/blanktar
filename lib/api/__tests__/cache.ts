import withCache from '../cache';


test('hit', async () => {
    const handler = withCache((req, res) => {
        throw new Error("don't call me!");
    }, {
         etag: '"test"',
         control: 'public, max-age=123',
    });
    const respHeaders = {};
    let respCode = 0;

    await handler({
        headers: {'if-none-match': '"test"'},
    }, {
        setHeader(name, value) {
            respHeaders[name] = value;
            return this;
        },
        status(code) {
            respCode = code;
            return this;
        },
        end() {
            return this;
        },
    });

    expect(respHeaders).toStrictEqual({
        ETag: '"test"',
        'Cache-Control': 'public, max-age=123',
    });
    expect(respCode).toBe(304);
});


test('miss', async () => {
    const respHeaders = {};
    let respCode = -1;
    let called = false;

    const handler = withCache((req, res) => {
        called = true;
    }, {
         etag: '"test"',
         control: 'public, max-age=123',
    });

    await handler({
        headers: {'if-none-match': '"test2"'},
    }, {
        setHeader(name, value) {
            respHeaders[name] = value;
            return this;
        },
        status(code) {
            respCode = code;
            return this;
        },
        end() {
            return this;
        },
    });

    expect(called).toBe(true);
    expect(respHeaders).toStrictEqual({
        ETag: '"test"',
        'Cache-Control': 'public, max-age=123',
    });
    expect(respCode).toBe(-1);
});
