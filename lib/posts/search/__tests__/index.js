import search from '../';


describe('single query', () => {
    test('hit', () => {
        const result = search('python', 0, 10);

        expect(result.totalCount).toBeGreaterThan(0);
        expect(result.posts.length).toBe(10);
    });

    test('miss', () => {
        const result = search('983nq475v90q287540v9817n349rujriouf98', 0, 10);

        expect(result.totalCount).toBe(0);
        expect(result.posts.length).toBe(0);
    });
});

describe('multi query', () => {
    test('hit', () => {
        const result = search('python ライブラリ', 0, 10);

        expect(result.totalCount).toBeGreaterThan(0);
        expect(result.posts.length).toBe(10);
    });

    test('miss', () => {
        const result = search('983nq475v90q287540 v9817n349rujriouf98', 0, 10);

        expect(result.totalCount).toBe(0);
        expect(result.posts.length).toBe(0);
    });
});
