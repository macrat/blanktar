import {date2str, date2readable} from '../DateTime';


test('date2str', () => {
    expect(date2str(new Date('2001-01-02T03:04:05+0900'))).toBe('2001/01/02 3:04');
});


test('date2readable', () => {
    expect(date2readable(new Date('2001-01-02T03:04:05+0900'))).toBe('2001年1月2日 3時4分の記事');
});
