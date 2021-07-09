import { FC } from 'react';
import Link from 'next/link';


const Navigation: FC = () => (
    <nav>
        <ul aria-label="サイトのメニュー">
            <li className="about"><Link href="/about"><a>about</a></Link></li>
            <li className="blog"><Link href="/blog"><a>blog</a></Link></li>
            <li className="works"><Link href="/works"><a>works</a></Link></li>
            <li className="photos"><Link href="/photos"><a>photos</a></Link></li>
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
                padding: 3px 10px;
                z-index: 1;
                color: inherit;
                text-decoration: none;
                transition: color .2s ease;
            }
            li:hover a, li:focus-within a {
                color: var(--colors-bg);
                outline: none;
            }
            li:hover::before, li:focus-within::before {
                top: 0;
                height: 100%;
            }

            a {
                animation: menu-fg .3s ease both;
            }
            .blog a { animation-delay: .1s; }
            .works a { animation-delay: .2s; }
            .photos a { animation-delay: .3s; }
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
                background-color: var(--colors-fg);
                animation: menu-bg .3s ease;
                transition: top .2s ease;
            }
            @keyframes menu-bg {
                from { transform: translate(0, -200%); }
                  to { transform: translate(0, 0); }
            }
            .blog::before { animation-delay: .1s; }
            .works::before { animation-delay: .2s; }
            .photos::before { animation-delay: .3s; }

            @media (prefers-reduced-motion: reduce) {
                a {
                    animation: none;
                }
                li::before, li::before {
                    top: 0;
                    opacity: 0;
                    transition: opacity .2s ease;
                    animation: none;
                }
                li:hover::before, li:focus-within::before {
                    opacity: 1;
                }
            }
        `}</style>
    </nav>
);


export default Navigation;
