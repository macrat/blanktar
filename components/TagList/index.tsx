import { FC, ReactNode } from 'react';
import Link from 'next/link';

import { className, styles } from './style';


type ChildrenProps = {
    tag: string;
    props: {
        className: string;
        "aria-label": string;
    };
};


export type Props = {
    tags: string[];
    children: (props: ChildrenProps) => ReactNode;
};


const TagList: FC<Props> = ({ tags, children }) => (
    <ul aria-label="この記事に付けられたタグ">
        {tags.map(tag => (
            <li key={tag}>
                <Link href={{ pathname: '/search', query: { q: tag } }} prefetch={false}>{
                    children({ tag, props: { className, "aria-label": `タグ「${tag}」` } })
                }</Link>
            </li>
        ))}

        {styles}

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
                margin: 2px 4px;
                position: relative;
                overflow: hidden;
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

            @media (prefers-reduced-motion: reduce) {
                li::before {
                    opacity: 0;
                    transition: opacity .2s ease;
                }
                li:hover::before, li:focus-within::before {
                    opacity: 1;
                }
            }

            @media print {
                li {
                    background-color: transparent;
                }
            }
        `}</style>
    </ul>
);


export default TagList;
