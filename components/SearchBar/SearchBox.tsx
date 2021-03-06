import { FC, useEffect, createRef } from 'react';
import Router from 'next/router';


export type Props = {
    query: string;
    setQuery: (query: string) => void;
    onSearch?: (query: string) => void;
    autoFocus?: boolean;
};


const SearchBox: FC<Props> = ({ query, setQuery, onSearch, autoFocus, children }) => {
    const input = createRef<HTMLInputElement>();
    if (autoFocus) {
        useEffect(() => {
            input.current?.focus();
        }, []);
    }

    return (
        <form
            role="search"
            aria-labelledby="in-site-search--label"
            action="/search"
            target="_top"
            onSubmit={ev => {
                ev.preventDefault();
                if (onSearch) {
                    return onSearch(query);
                }
                Router.push({ pathname: '/search', query: { q: query } });
            }}>

            <label>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" aria-hidden="true">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>

                <span id="in-site-search--label">サイト内検索</span>
                <input
                    ref={input}
                    type="search"
                    name="q"
                    value={query}
                    onChange={ev => setQuery(ev.target.value)}
                    aria-label="検索キーワード" />
            </label>

            {children}

            <style jsx>{`
                label {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                svg {
                    flex: 0 0 auto;
                    height: 100%;
                    width: auto;
                }
                path {
                    fill: var(--colors-fg);
                }
                span {
                    display: none;
                }
                input {
                    flex: 1 1 0;
                    background-color: transparent;
                    border: none;
                    border-bottom: 1px solid var(--colors-fg);
                    color: var(--colors-fg);
                    padding: 2px 4px;
                    -webkit-appearance: none;  // for safari
                }
                :focus {
                    outline: none;
                }
            `}</style>
        </form>
    );
};


export default SearchBox;
