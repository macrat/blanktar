import {FC} from 'react';
import Link from 'next/link';
import {useAmp} from 'next/amp';

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
                    <p>{description}</p>
                    {useAmp() ? <a href={href} className="list-link" /> : ""}
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
                margin: 0;
                padding: 0;
            }
            li {
                display: block;
                position: relative;
                margin: 5mm 0;
                overflow: hidden;
            }
            div {
                display: block;
                padding: 7mm 5mm;
                cursor: pointer;
                transition: padding .6s ease;
            }
            @media (max-width: 40em) {
                div {
                    padding: 7mm 2mm;
                }
            }
            a, a:hover, a:focus {
                color: inherit;
                text-decoration: none;
                outline: none;
            }
            .list-link {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1;
            }
            h2 {
                margin: -1mm -3pt 2mm;
                font-size: 24pt;
                font-weight: 300;
                line-height: 1.2em;
            }
            div :global(li) {
                position: relative;
                z-index: 10;
            }
            p {
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

            @media screen and (prefers-reduced-motion: reduce) {
                .line {
                    display: block;
                    opacity: 0;
                    transition: opacity .2s ease;
                }
                ol li:hover svg.line, ol li:focus-within svg.line {
                    opacity: 1;
                    animation: none;
                }
            }
        `}</style>
    </ol>
);


export default ArticleList;
