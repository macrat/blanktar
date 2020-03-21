import {FC} from 'react';


export type Props = {};


const Hr: FC<Props> = ({}) => (
    <>
        <hr />

        <style jsx>{`
            hr {
                margin: 1cm auto;
                width: 15cm;
                max-width: 100%;
                height: .2mm;
                border: none;
                background-color: var(--colors-fg);
            }
        `}</style>
    </>
);


export default Hr;
