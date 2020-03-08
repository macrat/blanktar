import {FC} from 'react';


export type Props = {};


const Tr: FC<Props> = ({children}) => (
    <>
        <tr>
            {children}
        </tr>

        <style jsx>{`
            tr {
                border: 0 solid var(--colors-fg);
                border-width: .2mm 0;
            }
            tr:first-of-type, tr:last-of-type {
                border-width: 0;
            }
        `}</style>
    </>
);


export default Tr;
