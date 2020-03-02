import {FC} from 'react';
import Link from 'next/link';


export type Props = {
    current: number,
    total: number,
    href: (page: number) => string,
    as: (page: number) => string | undefined,
};


const Pagination: FC<Props> = ({current, total, href, as}) => (
    <ol>
        {[...new Array(total)].map((_, i) => (
            <li key={i}><Link href={href(i)} as={as(i)}><a className={current === i ? "current" : ""}>{i + 1}</a></Link></li>
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
                border: .2mm solid #322;
                color: #322;
                text-decoration: none;
            }
            a.current {
                color: #eee;
                background-color: #322;
            }
        `}</style>
    </ol>
);


export default Pagination;
