import {FC} from 'react';


export const date2str = (t: Date) => (
    `${t.getFullYear()}/${String(t.getMonth() + 1).padStart(2, '0')}/${String(t.getDate()).padStart(2, '0')} ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`
);


export type Props = {
    dateTime: Date,
};


const DateTime: FC<Props> = ({dateTime}) => (
    <time dateTime={dateTime.toISOString()}>{date2str(dateTime)}</time>
);


export default DateTime;
