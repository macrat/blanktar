import {FC} from 'react';


export type Props = {};


const Pre: FC<Props> = ({children}) => (
    <>
        <pre>{children}</pre>

        <style jsx>{`
            pre {
                border: .2mm solid #322;
                padding: 5mm;
                overflow: auto;
            }
        `}</style>
    </>
);


export default Pre;
