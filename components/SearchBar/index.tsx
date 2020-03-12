import {FC, useState} from 'react';

import SearchBox from './SearchBox';
import Suggestion from './Suggestion';


export type Props = {};


const SearchBar: FC<Props> = props => {
    const [query, setQuery] = useState<string>('');

    return (
        <div>
            <span>
                <SearchBox query={query} setQuery={setQuery} />
                <Suggestion query={query} />
            </span>

            <style jsx>{`
                div {
                    display: flex;
                    justify-content: flex-end;
                    width: 297mm;
                    max-width: 100%;
                    margin: 0 auto;
                }
                span {
                    display: inline-block;
                    width: 7cm;
                    position: relative;
                }

                @media (max-width: 311mm) {
                    div {
                        width: auto;
                        margin-right: 7mm;
                    }
                }

                @media (max-width: 15cm) {
                    div {
                        justify-content: center;
                        padding: 0 1cm;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    span {
                        flex: 1 1 0;
                    }
                }
            `}</style>
        </div>
    );
};


export default SearchBar;
