import {FC} from 'react';


export const date2str = (t: Date) => (
    `${t.getFullYear()}/${String(t.getMonth() + 1).padStart(2, '0')}/${String(t.getDate()).padStart(2, '0')} ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`
);


export const date2readable = (t: Date) => (
    `${t.getFullYear()}年${String(t.getMonth() + 1).padStart(2, '0')}月${String(t.getDate()).padStart(2, '0')}日 ${t.getHours()}時${t.getMinutes()}分の記事`
);


export type Props = {
    dateTime: Date,
};


const DateTime: FC<Props> = ({dateTime}) => (
    <time dateTime={dateTime.toISOString()} aria-label={date2readable(dateTime)}>{date2str(dateTime)}</time>
);


export default DateTime;
