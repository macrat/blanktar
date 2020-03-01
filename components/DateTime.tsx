import {FC} from 'react';


export const date2str = (t: Date) => (
    `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`
);


export type Props = {
    dateTime: Date,
};


const DateTime: FC<Props> = ({dateTime}) => (
    <time dateTime={dateTime.toISOString()}>{date2str(dateTime)}</time>
);


export default DateTime;
