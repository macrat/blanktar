import {FC} from 'react';
import Link from 'next/link';

import colors from '../../lib/colors';

import Navigation from './Navigation';


export type Props = {};


const Header: FC<Props> = () => (
    <header>
        <h1><Link href="/"><a>Blanktar</a></Link></h1>

        <Navigation />

        <style jsx>{`
            header {
                text-align: center;
                margin: 1cm 0 1cm;
            }
            h1 {
                font-size: 8mm;
                font-weight: 300;
                margin: 0;
            }
            h1::after {
                content: '';
                display: block;
                height: .2mm;
                width: 5cm;
                position: relative;
                left: calc(50% - 2.5cm);
                background-color: ${colors.fg};
            }
            a {
                color: inherit;
                text-decoration: none;
            }
            a:hover, a:focus {
                color: inherit;
            }
        `}</style>
    </header>
);


export default Header;
