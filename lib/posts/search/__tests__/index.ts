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

describe('empty query', () => {
    test('0 length query', () => {
        const result = search('', 0, 10);

        expect(result.totalCount).toBe(0);
        expect(result.posts.length).toBe(0);
    });

    test('whitespace queries', () => {
        const result = search(' \t \t', 0, 10);

        expect(result.totalCount).toBe(0);
        expect(result.posts.length).toBe(0);
    });
});

describe('ignore case', () => {
    const posts = [
        {
            title: 'Hello World',
            lowerTitle: 'hello world',
            year: 2001,
            month: 2,
            pubtime: new Date().getTime(),
            tags: [],
            lowerTags: [],
            href: '/path/to/content',
            content: 'FOO bar Baz',
            lowerContent: 'foo bar baz',
        },
    ];

    const result = {
        totalCount: 1,
        posts: [
            {
                title: 'Hello World',
                pubtime: posts[0].pubtime,
                summary: '',
                href: '/path/to/content',
            },
        ],
    };

    const tests = [
        ['foo'],
        ['FOO'],
        ['bar'],
        ['BAR'],
        ['baz'],
        ['BAZ'],
        ['Baz'],
    ];

    test.each(tests)('%s', (query) => {
        expect(search(query, 0, 10, posts)).toStrictEqual(result);
    });
});
