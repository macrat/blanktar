import React, {FC} from 'react';
import Link from 'next/link';

import PageLink, {HrefFunc} from './PageLink';


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
                <li className="prev keep"><Link href={href(current - 1)}><a aria-label="前のページへ">前へ</a></Link></li>
            ) : null}

            {[...new Array(to - from)].map((_, i) => (
                <li
                    key={i + from}
                    className={(current == i + from ? "current " : "") + (Math.abs(current - (i + from)) <= 2 ? "keep" : "")}>

                    <PageLink current={current === i + from} page={i + from} href={href} />
                </li>
            ))}

            {current < total ? (
                <li className="next keep"><Link href={href(current + 1)}><a aria-label="次のページへ">次へ</a></Link></li>
            ) : null}

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
                .prev a, .next a {
                    color: inherit;
                    text-decoration: none;
                }
                @media (max-width: 34em) {
                    li:not(.keep) {
                        display: none;
                    }
                }
                @media (max-width: 24em) {
                    li {
                        display: none;
                    }
                    li.current, li.next, li.prev {
                        display: inline-block;
                    }
                }
            `}</style>
        </ol>
    );
};


export default Pagination;
