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
                border: .2mm solid #332;
            }
        `}</style>
    </>
);


export default InlineCode;
