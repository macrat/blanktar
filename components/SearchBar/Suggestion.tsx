import {FC, useState, useEffect} from 'react';
import Link from 'next/link';
import {useDebounce} from 'use-debounce';

import {searchTitle, Response as Posts} from '../../lib/posts';


export type Props = {
    query: string,
};


const Suggestion: FC<Props> = ({query}) => {
    const [suggest, setSuggest] = useState<{title: string, href: string}[]>([]);
    const [delayedQuery] = useDebounce(query, 50);

    useEffect(() => {
        if (query) {
            searchTitle(undefined, query).then(x => setSuggest(x));
        } else {
            setSuggest([]);
        }
    }, [delayedQuery]);


    return (
        <ul aria-label={`「${query}」に関連しそうな記事`}>
            {suggest.map(x => (
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
