import {FC} from 'react';
import Link from 'next/link';
import {UrlObject} from 'url';


type HrefFunc = (page: number) => string | UrlObject;


const PageLink: FC<{current: boolean, page: number, href: HrefFunc}> = ({current, page, href}) => (
    <>
        <Link href={href(page)}>
            <a className={current ? "current" : ""} aria-label={current ? `${page}ページ。これは現在のページです` : `${page}ページ`}>
                {page}
                <svg width="2.5em" height="1.5em" viewBox="0 0 50 30">
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
            a.current {
                color: var(--colors-bg);
                background-color: var(--colors-fg);
            }
            a:hover, a:focus {
                color: var(--colors-fg);
                outline: none;
            }
            a.current:hover, a.current:focus {
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
            a.current polyline {
                stroke: var(--colors-accent);
                stroke-width: .8mm;
            }
            a:hover polyline, a:focus polyline {
                stroke-dashoffset: 0;
            }

            @media screen and (prefers-reduced-motion: reduce) {
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


export type Props = {
    current: number,
    total: number,
    href: HrefFunc,
};


const Pagination: FC<Props> = ({current, total, href}) => {
    const size = 3;
    const from = Math.max(1, current - size - Math.max(0, current + size - total));
    const to = Math.min(total + 1, current + size + 1 + Math.max(0, size + 1 - current));

    return (
        <ol aria-label="ページの選択">
            {current > 1 ? (
                <li className="prev"><Link href={href(current - 1)}><a aria-label="前のページへ">前へ</a></Link></li>
            ) : (
                <li className="prev disabled" aria-label="このページが最初のページです">前へ</li>
            )}

            {[...new Array(to - from)].map((_, i) => (
                <li
                    key={i + from}
                    className={(current == i + from ? "current " : "") + (Math.abs(current - (i + from)) <= 2 ? "keep" : "")}>

                    <PageLink current={current === i + from} page={i + from} href={href} />
                </li>
            ))}

            {current < total ? (
                <li className="next"><Link href={href(current + 1)}><a aria-label="次のページへ">次へ</a></Link></li>
            ) : (
                <li className="next disabled" aria-label="このページが最後のページです">次へ</li>
            )}

            <style jsx>{`
                ol {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin: 0;
                    padding: 0;
                }
                li {
                    display: inline-block;
                    margin: 3mm 2mm;
                }
                .disabled {
                    opacity: .4;
                    cursor: default;
                }
                .prev a, .next a {
                    color: inherit;
                    text-decoration: none;
                }
                @media (max-width: 34em) {
                    li:not(.keep):not(.next):not(.prev) {
                        display: none;
                    }
                }
                @media (max-width: 24em) {
                    li:not(.current):not(.next):not(.prev) {
                        display: none;
                    }
                }
            `}</style>
        </ol>
    );
};


export default Pagination;
