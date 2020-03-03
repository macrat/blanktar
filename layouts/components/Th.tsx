import {FC} from 'react';


export type Props = {
    align?: 'left' | 'center' | 'right' | 'justify' | 'char',
};


const Th: FC<Props> = ({align, children}) => (
    <>
        <th align={align}>
            {children}
        </th>

        <style jsx>{`
            th {
                padding: 1mm 4mm;
                border: 0 solid #baa;
                border-width: 0 .2mm;
                border-bottom: .2mm solid #322;
            }
            th:first-of-type, th:last-of-type {
                border-width: 0 0 .2mm;
            }
        `}</style>
    </>
);


export default Th;
