import { FC } from 'react';


const Table: FC = ({ children }) => (
    <table>
        {children}

        <style jsx>{`
            border-collapse: collapse;
        `}</style>
    </table>
);


export default Table;
