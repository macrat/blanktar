import { FC } from 'react';


const Tr: FC = ({ children }) => (
    <tr>
        {children}

        <style jsx>{`
            border: 0 solid var(--colors-fg);
            border-width: .2mm 0;

            :first-of-type, :last-of-type {
                border-width: 0;
            }
        `}</style>
    </tr>
);


export default Tr;
