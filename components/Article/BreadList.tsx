import React, {FC} from 'react';
import Link from 'next/link';
import preval from 'preval.macro';

import JsonLD from '../JsonLD';


const BreadCrumbIcon = preval`
    module.exports = 'data:image/svg+xml;base64,' + Buffer.from(${'`'}
        <?xml version="1.0" encoding="UTF-8" ?>

        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 5 10">
            <defs><style><![CDATA[
                polyline{stroke:#402020}

                @media (prefers-color-scheme: dark) {
                    polyline{stroke:#fcf8f5}
                }
            ]]></style></defs>

            <polyline fill="none" points="0 0, 5 5, 0 10" stroke-width="0.5"/>
        </svg>
    ${'`'}.replace(/\\n+ */, '')).toString('base64');
`;


export type Props = {
    pages: {
        title: string;
        href: string;
        as?: string;
        description?: string;
    }[];
};


const BreadList: FC<Props> = ({pages}) => (
    <ol aria-label="この記事の場所">
        <li className="top"><Link href="/"><a aria-label="トップページ">top</a></Link></li>

        {pages.slice(0, -1).map(p => (
            <li key={p.as ?? p.href}>
                <Link href={p.href} as={p.as}><a aria-label={p.description}>{p.title}</a></Link>
            </li>
        ))}

        <JsonLD data={{
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Blanktar',
                    item: 'https://blanktar.jp',
                },
                ...pages.map((p, i) => ({
                    '@type': 'ListItem',
                    position: i + 2,
                    name: p.title,
                    item: 'https://blanktar.jp' + (p.as || p.href),
                })),
            ],
        }} />

        <style jsx>{`
            ol {
                display: inline-block;
                margin: 0 0 0 3mm;
                padding: 0;
                font-weight: 200;
                position: relative;
                z-index: 1;
            }
            li {
                display: inline-block;
            }
            .top::after {
                content: 'から';
            }
            li::after {
                content: 'の中にある';
                display: inline-block;
                width: 0;
                height: 0;
                padding: .4em .25em;
                overflow: hidden;
                background-image: url(${BreadCrumbIcon});
                background-size: contain;
                background-repeat: no-repeat;
                margin: .1em .3em -.05em;
            }
            a {
                color: inherit;
                text-decoration: none;
            }

            @media print {
                .top a {
                    display: none;
                }
                .top::before {
                    content: 'blanktar.jp';
                }
                .top::after, li::after {
                    content: '>';
                    display: inline;
                    background: none;
                }
            }
        `}</style>
    </ol>
);


export default BreadList;
