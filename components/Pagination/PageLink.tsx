import React, { FC } from 'react';
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
                {page}
                <svg width="2.5em" height="1.5em" viewBox="0 0 50 30" aria-hidden="true">
                    <polyline points="50 0, 50 30, 0 30, 0 0, 50, 0" fill="none" strokeWidth=".5mm" />
                </svg>
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
                background-color: var(--colors-fg);
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
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            polyline {
                stroke: var(--colors-fg);
                stroke-dasharray: 160;
                stroke-dashoffset: 160;
                transition: stroke-dashoffset .4s ease;
            }
            .current polyline {
                stroke: var(--colors-accent);
                stroke-width: .8mm;
            }
            a:hover polyline, a:focus polyline {
                stroke-dashoffset: 0;
            }

            @media (prefers-reduced-motion: reduce) {
                polyline {
                    stroke-dasharray: 0;
                    stroke-dashoffset: 0;
                    opacity: 0;
                    transition: opacity .2s ease;
                }
                a:hover polyline, a:focus polyline {
                    opacity: 1;
                }
            }
        `}</style>
    </>
);


export default PageLink;
