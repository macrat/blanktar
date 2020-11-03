import { shallow } from 'enzyme';

import PS from '../PS';


test('date formatting', () => {
    const ps = shallow(
        <PS date="2001-02-03">hello world</PS>
    );

    expect(ps.find('time').text()).toBe('2001-02-03');
    expect(ps.find('time').prop('dateTime')).toBe('2001-02-03');
});
