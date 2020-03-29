import {FC} from 'react';


export const date2str = (t: Date) => (
    `${t.getFullYear()}/${String(t.getMonth() + 1).padStart(2, '0')}/${String(t.getDate()).padStart(2, '0')} ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`
);


export const date2readable = (t: Date) => (
    `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日 ${t.getHours()}時${t.getMinutes()}分`
);


export type Props = {
    dateTime: Date,
    readableSuffix?: string,
};


const DateTime: FC<Props> = ({dateTime, readableSuffix='の記事'}) => (
    <time dateTime={dateTime.toISOString()} aria-label={date2readable(dateTime) + readableSuffix}>{date2str(dateTime)}</time>
);


export default DateTime;
