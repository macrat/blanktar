import {FC} from 'react';
import Link from 'next/link';


export type Props = {
    tags: string[],
};


const TagList: FC<Props> = ({tags}) => (
    <ul>
        {tags.map(x => (
            <li key={x}><Link href={{pathname: '/search', query: {q: x}}}><a>{x}</a></Link></li>
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
                border-radius: 4px;
                margin: 2px 4px;
                position: relative;
            }
            li a {
                position: relative;
                color: var(--colors-bg);
                text-decoration: none;
                display: inline-block;
                padding: 2px 4px;
                transition: color .1s ease;
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
                background-color: var(--colors-fg);
                transition: height .1s ease, top .1s ease;
            }
            li:hover::before, li:focus-within::before {
                height: 0;
            }
            @media (prefers-color-scheme: dark) {
                li:hover::before, li:focus-within::before {
                    top: 100%;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                li::before {
                    opacity: 1;
                    transition: opacity .2s ease;
                }
                li:hover::before, li:focus-within::before {
                    top: 0;
                    height: 100%;
                    opacity: 0;
                }
            }
        `}</style>
    </ul>
);


export default TagList;
