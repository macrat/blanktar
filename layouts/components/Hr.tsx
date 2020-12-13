import { FC } from 'react';


const Hr: FC = () => (
    <>
        <hr />

        <style jsx>{`
            margin: 1cm auto;
            width: 15cm;
            max-width: 100%;
            height: .2mm;
            border: none;
            background-color: var(--colors-fg);
        `}</style>
    </>
);


export default Hr;
