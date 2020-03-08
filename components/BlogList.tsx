import {FC} from 'react';
import Link from 'next/link';

import {PageData} from '../lib/posts';

import DateTime from './DateTime';
import TagList from './Article/TagList';
import JsonLD from './JsonLD';


export type Props = {
    posts: PageData[],
};


const ArticleList: FC<Props> = ({posts}) => (
    <ol>
        {posts.map(({href, title, pubtime, tags, description}) => (
            <li key={href}>
                <svg width="100%" height="1px" className="line top"><rect x="0" y="0" width="100%" height="100%" /></svg>
                <svg width="1px" height="100%" className="line left"><rect x="0" y="0" width="100%" height="100%" /></svg>

                <Link href={href}><div role="link">
                    <DateTime dateTime={new Date(pubtime)} />
                    <a href={href}><h2>{title}</h2></a>
                    <TagList tags={tags} />
                    <span>{description}</span>
                </div></Link>

                <svg width="100%" height="1px" className="line bottom"><rect x="0" y="0" width="100%" height="100%" /></svg>
                <svg width="1px" height="100%" className="line right"><rect x="0" y="0" width="100%" height="100%" /></svg>
            </li>
        ))}

        <JsonLD data={{
            '@type': 'ItemList',
            itemListElement: posts.map(({href}, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                url: 'https://blanktar.jp' + href,
            })),
        }} />

        <style jsx>{`
            ol {
                margin: 0 5mm;
                padding: 0;
            }
            @media screen and (max-width: 5cm) {
                ol {
                    margin: 0 2mm;
                }
            }
            li {
                display: block;
                position: relative;
                margin: 7mm 0;
                overflow: hidden;
            }
            div {
                display: block;
                padding: 5mm 5mm;
                cursor: pointer;
            }
            a, a:hover, a:focus {
                color: inherit;
                text-decoration: none;
                outline: none;
            }
            h2 {
                margin: -1mm -3pt 2mm;
                font-size: 24pt;
                font-weight: 300;
                line-height: 1.2em;
            }
            span {
                display: block;
                margin: 3mm 0 0;
            }

            .line {
                display: none;
                position: absolute;
            }
            .line rect {
                fill: var(--colors-fg);
            }
            .line.bottom {
                bottom: 0;
            }
            .line.right {
                top: 0;
                right: 0;
            }
            li:hover .line, li:focus-within .line {
                display: block;
            }
            li:hover .line.top, li:focus-within .line.top { animation: line-horizontal .4s ease both; }
            li:hover .line.left, li:focus-within .line.left { animation: line-vertical .1s ease both; }
            li:hover .line.bottom, li:focus-within .line.bottom { animation: line-horizontal .4s ease .1s both; }
            li:hover .line.right, li:focus-within .line.right { animation: line-vertical .1s ease .4s both; }

            @keyframes line-horizontal {
                from { transform: translate(-100%, 0); }
                  to { transform: translate(0, 0); }
            }
            @keyframes line-vertical {
                from { transform: translate(0, -100%); }
                  to { transform: translate(0, 0); }
            }

            @media (prefers-reduced-motion: reduce) {
                .line {
                    display: block;
                    opacity: 0;
                    transition: opacity .2s ease;
                }
                li:hover .line, li:focus-within .line {
                    opacity: 1;
                    animation: none !important;
                }
            }
        `}</style>
    </ol>
);


export default ArticleList;
