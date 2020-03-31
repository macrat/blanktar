import {FC} from 'react';
import Link from 'next/link';


export type Props = {
    tags: string[],
};


const TagList: FC<Props> = ({tags}) => (
    <ul aria-label="この記事に付けられたタグ">
        {tags.map(x => (
            <li key={x}><Link href={{pathname: '/search', query: {q: x}}}><a aria-label={`タグ「${x}」`}>{x}</a></Link></li>
        ))}

        <style jsx>{`
            ul {
                display: block;
                margin: 0 -4px;
                padding: 0;
            }
            li {
                display: inline-block;
                border: 1px solid var(--colors-fg);
                background-color: var(--colors-fg);
                border-radius: .5mm;
                margin: 2px 4px;
                position: relative;
                overflow: hidden;
            }
            a {
                position: relative;
                color: var(--colors-bg);
                text-decoration: none;
                display: inline-block;
                padding: 2px 4px;
                transition: color .2s ease;
            }
            a:focus {
                outline: none;
            }
            li:hover a, li:focus-within a {
                color: var(--colors-fg);
            }
            li::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: var(--colors-bg);
                transform: scaleY(0);
                transition: transform .2s ease;
            }
            li:hover::before, li:focus-within::before {
                transform: scaleY(1);
            }

            @media screen and (prefers-reduced-motion: reduce) {
                li::before {
                    opacity: 0;
                    transition: opacity .2s ease;
                }
                li:hover::before, li:focus-within::before {
                    opacity: 1;
                }
            }
        `}</style>
    </ul>
);


export default TagList;
