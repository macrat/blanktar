import {FC} from 'react';


export type Props = {};


const InlineCode: FC<Props> = ({children}) => (
    <>
        <code>{children}</code>

        <style jsx>{`
            code {
                display: inline-block;
                padding: 0 .5em;
                margin: 0 .2em;
                border: .2mm solid var(--colors-dark-fg);
            }
        `}</style>
    </>
);


export default InlineCode;
