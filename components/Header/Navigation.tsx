import {FC} from 'react';
import Link from 'next/link';


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
                animation: menu-fg .3s ease both;
            }
            li:nth-child(2) { animation-delay: .1s; }
            li:nth-child(3) { animation-delay: .2s; }
            li:nth-child(4) { animation-delay: .3s; }
            @keyframes menu-fg {
                     0% { color: transparent; }
                    50% { color: transparent; }
                50.001% { color: inherit; }
            }
            li::before {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                width: 100%;
                top: 100%;
                height: 0;
                background-color: #322;
                animation: menu-bg .3s ease;
                transition: top .2s ease, height .2s ease;
            }
            @keyframes menu-bg {
                0% { top: 0; height: 0; }
                50% { top: 0; height: 100%; }
                100% { top: 100%; height: 0; }
            }
            li:nth-child(2)::before { animation-delay: .1s; }
            li:nth-child(3)::before { animation-delay: .2s; }
            li:nth-child(4)::before { animation-delay: .3s; }

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
                color: white;
            }
            li:hover::before, li:focus-within::before {
                top: 0;
                height: 100%;
            }
            a:focus {
                outline: none;
            }
        `}</style>
    </nav>
);


export default Navigation;
