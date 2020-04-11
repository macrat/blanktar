import React, {FC} from 'react';
import Link from 'next/link';
import {useAmp} from 'next/amp';

import ListItem from './ListItem';
import DateTime from '../DateTime';
import TagList from '../TagList';
import JsonLD from '../JsonLD';


export type Props = {
    posts: {
        href: string,
        title: string,
        pubtime: string,
        tags: string[],
        description: string | undefined,
    }[],
};


const BlogList: FC<Props> = ({posts}) => (
    <ol aria-label="記事の一覧">
        {posts.map(({href, title, pubtime, tags, description}) => (
            <ListItem key={href}>
                <Link href={href}><a>
                    <DateTime dateTime={new Date(pubtime)} />
                    <h2>{title}</h2>
                    <TagList tags={tags}>{
                        ({tag, props}) => <button {...props}>{tag}</button>
                    }</TagList>
                    {description ? <p>{description}</p> : null}
                    {useAmp() ? <a href={href} className="list-link" /> : ""}
                </a></Link>
            </ListItem>
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
            a {
                display: block;
                padding: 7mm 5mm;
                cursor: pointer;
                transition: padding .6s ease;
            }
            @media (max-width: 40em) {
                a {
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
        `}</style>
    </ol>
);


export default BlogList;
