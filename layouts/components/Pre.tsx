import {FC} from 'react';


export type Props = {};


const Pre: FC<Props> = ({children}) => (
    <>
        <pre>{children}</pre>

        <style jsx>{`
            pre {
                padding: 5mm;
                overflow: auto;
                background-color: var(--colors-block-bg);
            }
        `}</style>
    </>
);


export default Pre;
