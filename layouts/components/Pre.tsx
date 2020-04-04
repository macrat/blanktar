import {FC} from 'react';


export type Props = {};


const Pre: FC<Props> = ({children}) => (
    <>
        <pre>{children}</pre>

        <style jsx>{`
            padding: 5mm;
            overflow: auto;
            background-color: var(--colors-block-bg);

            @media print {
                background: none;
                border: 1px solid var(--colors-fg);
            }
        `}</style>
    </>
);


export default Pre;
