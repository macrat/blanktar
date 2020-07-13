import React from 'react';
import { shallow } from 'enzyme';

import Pagination from '..';


describe('Pagination', () => {
    test('first of many pages', () => {
        const pagination = shallow(
            <Pagination current={1} total={10} href={() => '/'} />
        ).render();

        expect(pagination.find('.prev').length).toBe(0);
        expect(pagination.find('.next').length).toBe(1);

        expect(pagination.text()).toBe('1234567次へ');
        expect(pagination.find('.current').text()).toBe('11');
    });

    test('first of less pages', () => {
        const pagination = shallow(
            <Pagination current={1} total={5} href={() => '/'} />
        ).render();

        expect(pagination.find('.prev').length).toBe(0);
        expect(pagination.find('.next').length).toBe(1);

        expect(pagination.text()).toBe('12345次へ');
        expect(pagination.find('.current').text()).toBe('11');
    });

    test('last of many pages', () => {
        const pagination = shallow(
            <Pagination current={10} total={10} href={() => '/'} />
        ).render();

        expect(pagination.find('.prev').length).toBe(1);
        expect(pagination.find('.next').length).toBe(0);

        expect(pagination.text()).toBe('前へ45678910');
        expect(pagination.find('.current').text()).toBe('1010');
    });

    test('last of less pages', () => {
        const pagination = shallow(
            <Pagination current={5} total={5} href={() => '/'} />
        ).render();

        expect(pagination.find('.prev').length).toBe(1);
        expect(pagination.find('.next').length).toBe(0);

        expect(pagination.text()).toBe('前へ12345');
        expect(pagination.find('.current').text()).toBe('55');
    });
});
