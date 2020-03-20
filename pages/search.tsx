import {useState, useEffect} from 'react';
import {NextPage} from 'next';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useDebounce} from 'use-debounce';
import fetch from 'unfetch';

import {SuccessResponse} from './api/search';

import Article from '../components/Article';
import MetaData from '../components/MetaData';
import SearchBox from '../components/SearchBar/SearchBox';
import DateTime from '../components/DateTime';
import Pagination from '../components/Pagination';


export type Props = {
    query: string,
    page: number,
    __disableSearchBar: boolean,
};


const Search: NextPage<Props> = ({query: initialQuery, page}) => {
    const [query, setQuery] = useState<string>(initialQuery);
    const [result, setResult] = useState<SuccessResponse>({posts: [], totalCount: 0});
    const [searchQuery, cancelDebounce] = useDebounce(query, 300);
    const router = useRouter();

    const doSearch = () => {
        if (!query) {
            setResult({posts: [], totalCount: 0});
            return;
        }

        fetch(`/api/search?${new URLSearchParams({
            q: query,
            offset: String(10 * ((page ?? 1) - 1)),
            limit: '10',
        })}`).then(resp => {
            if (!resp.ok) {
                throw new Error(resp.statusText);
            }
            return resp.json();
        }).then(setResult);

        cancelDebounce();
    };

    useEffect(doSearch, [searchQuery]);

    const replaceState = (from: string) => {
        const url = `/search?q=${encodeURIComponent(query)}`;
        history.replaceState({...history.state, url: url, as: url, from: from}, '', url);
    };
    const pushState = (from: string) => {
        const url = `/search?q=${encodeURIComponent(query)}`;
        history.pushState({...history.state, url: url, as: url, from: from}, '', url);
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
        setQuery(String(router.query.q || ''));
        doSearch();
    }, [router.query]);

    return (
        <Article>
            <MetaData
                title={`${searchQuery}の検索結果`}
                description={`BlankTarの記事を"${searchQuery}"で検索した結果の一覧`} />

            <SearchBox
                query={query}
                setQuery={q => setQuery(q)}
                onSearch={() => forceSearch()}
                autoFocus />

            <ul>
                {result.posts.map(x => (
                    <li key={x.href}>
                        <Link href={x.href}><a>
                            <DateTime dateTime={new Date(x.pubtime)} />
                            {` ${x.title}`}
                        </a></Link>
                    </li>
                ))}
            </ul>

            <Pagination
                current={page}
                total={Math.ceil(result.totalCount / 20)}
                href={p => p === 1 ? `/search?q=${query}` : `/search?q=${query}&page=${p}`}
                />
        </Article>
    );
};


Search.getInitialProps = ({query}) => {
    return {
        query: String(query.q || ''),
        page: Number(String(query.page || 1)),
        __disableSearchBar: true,
    };
};


export default Search;
