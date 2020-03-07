import {FC} from 'react';

import colors from '../../lib/colors';


export type Props = {};


const Pre: FC<Props> = ({children}) => (
    <>
        <pre>{children}</pre>

        <style jsx>{`
            pre {
                padding: 5mm;
                overflow: auto;
                background-color: ${colors.darkbg}
            }
        `}</style>
    </>
);


export default Pre;
