import React, { FC } from 'react';


const BlockQuote: FC = ({ children }) => (
    <blockquote>
        {children}

        <style jsx>{`
            padding: 1mm 2mm 1mm 4mm;
            margin: 2mm;
            border-left: 1px solid var(--colors-dark-fg);
        `}</style>
    </blockquote>
);


export default BlockQuote;
