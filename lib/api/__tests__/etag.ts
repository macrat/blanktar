import etag from '../etag';


test('make etag of "hello world"', () => {
    expect(etag('hello world')).toBe('"5eb63bbbe01eeed093cb22bb8f5acdc3"');
});
