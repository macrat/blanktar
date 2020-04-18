import search from '../title';


describe('single query', () => {
    test('hit', () => {
        const result = search('python');

        expect(result.posts.length).toBe(5);
    });

    test('miss', () => {
        const result = search('iuahtp9a8wuhtjigfohna93tht03fhjqw');

        expect(result.posts.length).toBe(0);
    });
});

describe('multi query', () => {
    test('hit', () => {
        const result = search('py thon');

        expect(result.posts.length).toBe(5);
    });

    test('miss', () => {
        const result = search('iuahtp9a8wuhtjig fohna93tht03fhjqw');

        expect(result.posts.length).toBe(0);
    });
});
