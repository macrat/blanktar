import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';


export type Props = {
    snippet: string;
};


const RichSnippet: FC<Props> = ({ snippet }) => (
    <article>
        <ReactMarkdown source={snippet} />

        <style jsx>{`
            margin: 3mm 5mm 0;
            padding: 0 3mm;
            border: 1px solid var(--colors-fg);

            @media (max-width: 40em) {
                margin: 3mm 2mm 0;
            }
        `}</style>
    </article>
);


export default RichSnippet;
