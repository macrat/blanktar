import React, { useState, useEffect } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDebounce } from 'use-debounce';
import { pageview } from 'react-ga';

import search from '~/lib/posts/search';
import getSnippet from '~/lib/rich-snippet';
import { SuccessResponse } from './api/search';
import { useContext } from '~/lib/context';

import MetaData from '~/components/MetaData';
import Header from '~/components/Header';
import Article from '~/components/Article';
import SearchBox from '~/components/SearchBar/SearchBox';
import ListItem from '~/components/BlogList/ListItem';
import DateTime from '~/components/DateTime';
import Pagination from '~/components/Pagination';
import RichSnippet from '~/components/RichSnippet';
import JsonLD from '~/components/JsonLD';


const RESULTS_IN_PAGE = 10;


export type Props = {
    query: string;
    page: number;
    result: SuccessResponse;
};


const Search: NextPage<Props> = ({ query: initialQuery, result: initialResult, page: initialPage }) => {
    const [query, setQuery] = useState<string>(initialQuery);
    const [result, setResult] = useState<SuccessResponse>(initialResult);
    const [page, setPage] = useState<number>(initialPage);
    const [searchQuery, cancelDebounce] = useDebounce(query, 300);
    const router = useRouter();
    const { setLoading } = useContext();

    const doSearch = () => {
        if (!query) {
            setResult({ posts: [], totalCount: 0 });
            return;
        }

        setLoading(true);
        fetch(`/api/search?${new URLSearchParams({
            q: query,
            offset: String(RESULTS_IN_PAGE * (page - 1)),
            limit: String(RESULTS_IN_PAGE),
        })}`).then(resp => {
            setLoading(false);
            if (!resp.ok) {
                throw new Error(resp.statusText);
            }
            return resp.json();
        }).then(setResult);

        cancelDebounce();

        pageview( `/search?q=${encodeURIComponent(query)}`);
    };

    useEffect(doSearch, [searchQuery]);
    useEffect(doSearch, [page]);

    const makeURL = () => {
        if (!query) {
            return '/search';
        }
        return `/search?q=${encodeURIComponent(query)}`;
    };
    const replaceState = (from: string) => {
        const url = makeURL();
        history.replaceState({ ...history.state, url: url, as: url, from: from }, '', url);
    };
    const pushState = (from: string) => {
        const url = makeURL();
        history.pushState({ ...history.state, url: url, as: url, from: from }, '', url);
    };

    useEffect(() => {
        if (typeof history.state.from === 'undefined') {
            replaceState('query');
        } else if (history.state.from === 'auto') {
            replaceState('auto');
        } else {
            pushState('auto');
        }
    }, [query]);

    const forceSearch = () => {
        if (history.state.from === 'auto') {
            replaceState('enter');
        } else {
            pushState('enter');
        }
        doSearch();
    };

    useEffect(() => {
        setQuery(String(router.query.q ?? ''));
        setPage(Number(router.query.page ?? '1'));
    }, [router.query]);

    return (<>
        <MetaData
            title={`${searchQuery}の検索結果`}
            description={`Blanktarの記事を"${searchQuery}"で検索した結果の一覧`} />

        <Header />

        <Article>
            <SearchBox
                query={query}
                setQuery={q => {
                    if (q !== query) {
                        setPage(1);
                    }
                    setQuery(q);
                }}
                onSearch={() => forceSearch()}
                autoFocus />

            {result.posts.length === 0 ? (
                <p className="no-result">
                    一致する記事がありません

                    <style>{`
                        .no-result {
                            opacity: .5;
                            text-align: center;
                            font-size: 150%;
                            margin: 1cm 0;
                        }
                    `}</style>
                </p>
            ) : (<>
                {result.snippet ? (<>
                    <RichSnippet snippet={result.snippet.html} />

                    <JsonLD data={{
                        '@type': 'FAQPage',
                        mainEntity: [{
                            '@type': 'Question',
                            name: `${searchQuery}とは？`,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: result.snippet.summary,
                            },
                        }],
                    }} />
                </>) : null}

                <ul aria-label={`"${searchQuery}"の検索結果`}>
                    {result.posts.map(x => (
                        <ListItem key={x.href}>
                            <Link href={x.href}><a>
                                <DateTime dateTime={new Date(x.pubtime)} />
                                <h2 dangerouslySetInnerHTML={{ __html: x.title }} />
                                <p dangerouslySetInnerHTML={{ __html: x.summary }} />
                            </a></Link>
                        </ListItem>
                    ))}
                </ul>
            </>)}

            <Pagination
                current={page}
                total={Math.ceil(result.totalCount / RESULTS_IN_PAGE)}
                href={p => p === 1 ? `/search?q=${query}` : `/search?q=${query}&page=${p}`} />

            <style jsx>{`
                ul {
                    margin: 0;
                    padding: 0;
                }
                li {
                    display: block;
                }
                a {
                    display: block;
                    color: inherit;
                    text-decoration: none;
                    padding: 7mm 5mm;
                }
                a:hover, a:focus {
                    color: inherit;
                }
                @media (max-width: 40em) {
                    a {
                        padding: 7mm 2mm;
                    }
                }
                h2 {
                    margin: 0 0 2mm;
                    font-size: 18pt;
                    line-height: 1.2em;
                }
                p {
                    margin: 0;
                }
            `}</style>
        </Article>
    </>);
};


export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    const q = String(query.q ? query.q : '');
    const page = Number(String(query.page ? query.page : 1));

    const props: Props = {
        query: q,
        page: page,
        result: search(q, RESULTS_IN_PAGE * (page - 1), RESULTS_IN_PAGE),
    };

    const snippet = getSnippet(q);
    if (snippet !== undefined) {
        props.result.snippet = snippet;
    }

    return { props };
};


export default Search;
