import React, {FC} from 'react';


export type Props = {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char';
};


const Th: FC<Props> = ({align, children}) => (
    <th align={align}>
        {children}

        <style jsx>{`
            th {
                padding: 1mm 4mm;
                border: 0 solid var(--colors-dark-fg);
                border-width: 0 .2mm;
                border-bottom: .2mm solid var(--colors-fg);
            }
            :first-of-type, :last-of-type {
                border-width: 0 0 .2mm;
            }
        `}</style>
    </th>
);


export default Th;
