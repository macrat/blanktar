import getSnippet from '..';


describe('getSnippet', () => {
    test('not found', () => {
        expect(getSnippet('6950b55b-60bb-414d-b50a-469dbb586dc7')).toBe(undefined);
    });

    test('found', () => {
        const snippet = getSnippet('826E7f42-082c-4921-876d-4fdeb6c14a3B');

        expect(snippet).not.toBe(undefined);

        expect(snippet?.html).toBe([
            '<p><strong>826e7f42-082c-4921-876d-4fdeb6c14a3b</strong> is test word of rich snippet.</p>',
            '<p>this is second paragraph.</p>',
            '',
        ].join('\n'));

        expect(snippet?.summary).toBe('<strong>826e7f42-082c-4921-876d-4fdeb6c14a3b</strong> is test word of rich snippet.');
    });
});
