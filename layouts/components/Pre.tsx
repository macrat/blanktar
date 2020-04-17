import React, {FC} from 'react';


const Pre: FC = ({children}) => (
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
