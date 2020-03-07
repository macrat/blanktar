import {FC} from 'react';
import Link from 'next/link';

import colors from '../../lib/colors';


export type Props = {};


const Navigation: FC<Props> = () => (
    <nav>
        <ul>
            <li><Link href="/about"><a>about</a></Link></li>
            <li><Link href="/blog"><a>blog</a></Link></li>
            <li><Link href="/works"><a>works</a></Link></li>
            <li><Link href="/photos"><a>photos</a></Link></li>
        </ul>

        <style jsx>{`
            ul {
                margin: 0;
                padding: 0;
            }
            li {
                display: inline-block;
                margin: 2px 8px;
                position: relative;
                overflow: hidden;
            }
            a {
                position: relative;
                display: inline-block;
                padding: 2px 8px;
                z-index: 1;
                color: inherit;
                text-decoration: none;
                transition: color .2s ease;
            }
            li:hover a, li:focus-within a {
                color: ${colors.bg};
            }
            li:hover::before, li:focus-within::before {
                top: 0;
                height: 100%;
            }
            a:focus {
                outline: none;
            }

            a {
                animation: menu-fg .3s ease both;
            }
            li:nth-child(2) a { animation-delay: .1s; }
            li:nth-child(3) a { animation-delay: .2s; }
            li:nth-child(4) a { animation-delay: .3s; }
            @keyframes menu-fg {
                 0%     { opacity: 0; }
                40%     { opacity: 0; }
                40.001% { opacity: 1; }
            }
            li::before {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                width: 100%;
                top: 100%;
                height: 100%;
                background-color: ${colors.fg};
                animation: menu-bg .3s ease;
                transition: top .2s ease, height .2s ease;
            }
            @keyframes menu-bg {
                from { transform: translate(0, -200%); }
                  to { transform: translate(0, 0); }
            }
            li:nth-child(2)::before { animation-delay: .1s; }
            li:nth-child(3)::before { animation-delay: .2s; }
            li:nth-child(4)::before { animation-delay: .3s; }
        `}</style>
    </nav>
);


export default Navigation;
