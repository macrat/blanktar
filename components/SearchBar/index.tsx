import {FC} from 'react';

import SearchBox, {Props as SearchBoxProps} from './SearchBox';


export type Props = SearchBoxProps;


const SearchBar: FC<Props> = props => (
    <div>
        <span><SearchBox {...props} /></span>

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


export default SearchBar;
