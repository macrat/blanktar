import {FC} from 'react';


export type Props = {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char',
};


const Td: FC<Props> = ({align, children}) => (
    <>
        <td align={align}>
            {children}
        </td>

        <style jsx>{`
            td {
                padding: 1mm 4mm;
                border: 0 solid #baa;
                border-width: 0 .2mm;
            }
            td:first-of-type, td:last-of-type {
                border-width: 0;
            }
        `}</style>
    </>
);


export default Td;
