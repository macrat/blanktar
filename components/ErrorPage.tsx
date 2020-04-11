import React, {FC, useState} from 'react';

import MetaData from './MetaData';
import SearchBox from './SearchBar/SearchBox';


export type Props = {
    statusCode: number,
    title: string,
    message?: string,
};


const ErrorPage: FC<Props> = ({statusCode, title, message}) => {
    const [query, setQuery] = useState<string>('');

    return (
        <article>
            <MetaData title={title} />

            <header>
                <span className="status-code">{statusCode}</span>

                <div className="message">
                    <h1>{title}</h1>
                    {message ? (<span className="detail">{message}</span>) : null}
                </div>
            </header>

            <div className="search">
                <SearchBox query={query} setQuery={setQuery} />
            </div>

            <style jsx>{`
                header {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 1cm 5mm;
                }
                .status-code {
                    font-size: 16mm;
                    font-weight: 100;
                    margin: 0 5mm 0 0;
                    padding: 0 5mm 0 0;
                    border-right: .2mm solid var(--colors-fg);
                }
                h1 {
                    font-size: inherit;
                    margin: 0;
                    padding: 0;
                    line-height: inherit;
                    font-weight: 400;
                }
                .detail {
                    font-weight: 300;
                }
                .search {
                    width: 15cm;
                    max-width: calc(100% - 2cm);
                    margin: 2cm auto;
                    padding: 0 1cm;
                }
            `}</style>
        </article>
    );
};


export default ErrorPage;
