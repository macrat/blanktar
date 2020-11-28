import { shallow } from 'enzyme';

import PS from '../PS';


test('date formatting', () => {
    const ps = shallow(
        <PS date="2001-02-03" level={2}>hello world</PS>
    );

    expect(ps.find('h3').text()).toBe('2001-02-03 追記');
    expect(ps.find('time').prop('dateTime')).toBe('2001-02-03');
});
