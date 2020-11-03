import { FC, useState, useEffect } from 'react';
import Link from 'next/link';
import { useDebounce } from 'use-debounce';

import { SuccessResponse } from '~/pages/api/search/title';


export type Props = {
    query: string;
};


const Suggestion: FC<Props> = ({ query }) => {
    const [suggest, setSuggest] = useState<SuccessResponse>({ posts: [] });
    const [delayedQuery] = useDebounce(query, 50);

    useEffect(() => {
        if (!query) {
            setSuggest({ posts: [] });
            return;
        }

        fetch(`/api/search/title?${new URLSearchParams({
            q: query,
        })}`).then(resp => {
            if (!resp.ok) {
                throw new Error(resp.statusText);
            }
            return resp.json();
        }).then(setSuggest);
    }, [delayedQuery]);


    return (
        <ul aria-label={`「${query}」に関連しそうな記事`}>
            {suggest.posts.map(x => (
                <li key={x.href}><Link href={x.href}><a>{x.title}</a></Link></li>
            ))}

            <style jsx>{`
                ul {
                    position: absolute;
                    width: 100%;
                    box-sizing: border-box;
                    padding: 2mm;
                    margin: 0;
                    z-index: 10;
                    overflow: hidden;
                }
                li {
                    display: block;
                    background-color: var(--colors-bg);
                    padding: 0 2mm 5mm;
                    animation: list-show .2s ease both;
                }
                @keyframes list-show {
                    from { transform: translate(0, -100%); opacity: 0; }
                      to { transform: translate(0, 0); opacity: 1; }
                }
                a {
                    color: inherit;
                }
            `}</style>
        </ul>
    );
};


export default Suggestion;
