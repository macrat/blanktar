import { Benchmark } from 'asyncmark';

import search from '../';
import title from '../title';


test('search all', async () => {
    const result = await new Benchmark({
        name: 'search all',
        fun: () => {
            search('python', 0, 5);
        },
    }).run();

    result.assert('<=1ms');
});


test('search title', async () => {
    const result = await new Benchmark({
        name: 'search title',
        fun: () => {
            title('python');
        },
    }).run();

    result.assert('<=0.1ms');
});
