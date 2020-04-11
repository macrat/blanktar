import React, {FC} from 'react';


export type Props = {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char',
};


const Td: FC<Props> = ({align, children}) => (
    <td align={align}>
        {children}

        <style jsx>{`
            padding: 1mm 4mm;
            border: 0 solid var(--colors-dark-fg);
            border-width: 0 .2mm;

            :first-of-type, :last-of-type {
                border-width: 0;
            }
        `}</style>
    </td>
);


export default Td;
