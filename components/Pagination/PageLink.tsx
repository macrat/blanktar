import { FC } from 'react';
import Link from 'next/link';
import { UrlObject } from 'url';


export type HrefFunc = (page: number) => string | UrlObject;


export type Props = {
    current: boolean;
    page: number;
    href: HrefFunc;
};


const PageLink: FC<Props> = ({ current, page, href }) => (
    <>
        <Link href={href(page)}>
            <a className={current ? "current" : ""} aria-label={current ? `${page}ページ。これは現在のページです` : `${page}ページ`}>
                <svg width="3em" height="2em" viewBox="0 0 50 30" aria-hidden="true">
                    <g transform="translate( 0,  5)"><line x2="50" transform-origin=" 0  0" className="horizontal" /></g>
                    <g transform="translate( 5,  0)"><line y2="30" transform-origin=" 0 30" className="vertical"   /></g>
                    <g transform="translate( 0, 25)"><line x2="50" transform-origin="50 30" className="horizontal" /></g>
                    <g transform="translate(45,  0)"><line y2="30" tarnsform-origin="50  0" className="vertical"   /></g>
                    <rect x="5" y="5" width="40" height="20" />
                </svg>
                {page}
            </a>
        </Link>

        <style jsx>{`
            a {
                display: inline-block;
                width: 2.5em;
                height: 1.5em;
                text-align: center;
                color: var(--colors-fg);
                text-decoration: none;
                position: relative;
            }
            .current {
                color: var(--colors-bg);
            }
            rect {
                fill: none;
            }
            .current rect {
                fill: var(--colors-fg);
            }
            a:hover, a:focus {
                color: var(--colors-fg);
                outline: none;
            }
            .current:hover, .current:focus {
                color: var(--colors-bg);
            }
            svg {
                position: absolute;
                top: -.25em;
                left: -.25em;
                z-index: -1;
            }
            line {
                stroke: var(--colors-fg);
                stroke-width: .2mm;
                transition: transform .2s;
            }
            .horizontal {
                transform: scaleX(0);
            }
            .vertical {
                transform: scaleY(0);
            }
            .current line {
                stroke: var(--colors-accent);
                stroke-width: .4mm;
            }
            a:hover line, a:focus line {
                transform: scale(1, 1);
            }

            @media (prefers-reduced-motion: reduce) {
                line {
                    transform: scale(1, 1);
                    opacity: 0;
                    transition: opacity .2s ease;
                }
                a:hover line, a:focus line {
                    opacity: 1;
                }
            }
        `}</style>
    </>
);


export default PageLink;
