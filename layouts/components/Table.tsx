import {FC} from 'react';


export type Props = {};


const Table: FC<Props> = ({children}) => (
    <table>
        {children}

        <style jsx>{`
            border-collapse: collapse;
        `}</style>
    </table>
);


export default Table;
