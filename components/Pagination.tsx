import {FC} from 'react';
import Link from 'next/link';
import {UrlObject} from 'url';

import colors from '../lib/colors';


export type Props = {
    current: number,
    total: number,
    href: (page: number) => string | UrlObject,
};


const Pagination: FC<Props> = ({current, total, href}) => (
    <ol>
        {[...new Array(total)].map((_, i) => (
            <li key={i}><Link href={href(i + 1)}><a className={current === i + 1 ? "current" : ""}>{i + 1}</a></Link></li>
        ))}

        <style jsx>{`
            ol {
                display: flex;
                justify-content: center;
                margin: 0;
                padding: 0;
            }
            li {
                display: inline-block;
            }
            a {
                display: inline-block;
                margin: 3mm 2mm;
                width: 2em;
                text-align: center;
                border: .2mm solid ${colors.fg};
                color: ${colors.fg};
                text-decoration: none;
            }
            a.current {
                color: ${colors.bg};
                background-color: ${colors.fg};
            }
        `}</style>
    </ol>
);


export default Pagination;
