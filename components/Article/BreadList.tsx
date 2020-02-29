import {FC} from 'react';
import Link from 'next/link';


export type Props = {
    pages: {
        title: string,
        href: string,
        as?: string,
    }[],
};


const BreadList: FC<Props> = ({pages}) => (
    <ol>
        <li><Link href="/"><a>top</a></Link></li>

        {pages.slice(0, -1).map(p => (
            <li key={p.as ?? p.href}>
                <Link href={p.href} as={p.as}><a>{p.title}</a></Link>
            </li>
        ))}

        <style jsx>{`
            ol {
                margin: 0 0 0 3mm;
                padding: 0;
                font-weight: 200;
                position: relative;
                z-index: 1;
            }
            li {
                display: inline-block;
            }
            li::after {
                content: '>';
                display: inline-block;
                margin: 0 .3em;
            }
            a {
                color: inherit;
                text-decoration: none;
            }
        `}</style>
    </ol>
);


export default BreadList;
