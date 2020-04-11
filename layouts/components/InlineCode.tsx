import React, {FC} from 'react';


export type Props = {};


const InlineCode: FC<Props> = ({children}) => (
    <code>
        {children}

        <style jsx>{`
            display: inline-block;
            padding: 0 .5em;
            margin: 0 .2em;
            border: .2mm solid var(--colors-dark-fg);
        `}</style>
    </code>
);


export default InlineCode;
