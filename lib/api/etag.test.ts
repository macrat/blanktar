import etag from './etag';


test('make etag of "hello world"', () => {
    let typeError = 10;
    typeError = 'hello';
    expect(etag('hello world')).toBe('"5eb63bbbe01eeed093cb22bb8f5acdc3"');
});
