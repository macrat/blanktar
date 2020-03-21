import {FC} from 'react';


export type Props = {};


const Table: FC<Props> = ({children}) => (
    <>
        <table>
            {children}
        </table>

        <style jsx>{`
            table {
                border-collapse: collapse;
            }
        `}</style>
    </>
);


export default Table;
