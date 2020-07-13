import React from 'react';
import { shallow } from 'enzyme';

import Pagination from '..';


describe('Pagination', () => {
    test.each<[number, number, string]>([
        [1, 10, '1234567次へ'],
        [2, 10, '前へ1234567次へ'],
        [3, 10, '前へ1234567次へ'],
        [5, 10, '前へ2345678次へ'],
        [8, 10, '前へ45678910次へ'],
        [10, 10, '前へ45678910'],
        [1, 5, '12345次へ'],
        [4, 5, '前へ12345次へ'],
        [5, 5, '前へ12345'],
    ])('%i/%i => %s', (current, total, text) => {
        const pagination = shallow(
            <Pagination current={current} total={total} href={(page) => String(page)} />
        ).render();

        expect(pagination.text()).toBe(text);

        expect(pagination.find('.prev').length).toBe(text.includes('前へ') ? 1 : 0);
        expect(pagination.find('.next').length).toBe(text.includes('次へ') ? 1 : 0);

        expect(pagination.find('a.current').text()).toBe(String(current));
        expect(pagination.find('a.current').prop('href')).toBe(String(current));
    });
});
