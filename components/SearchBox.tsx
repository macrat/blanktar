import {FC} from 'react';


export type Props = {};


const SearchBox: FC<Props> = () => (
    <form>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#332" /></svg>

        <input type="search" />

        <style jsx>{`
            form {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: 297mm;
                max-width: 100%;
                margin: 0 auto;
            }
            svg {
                height: 100%;
                width: auto;
            }
            input {
                background-color: transparent;
                border: none;
                border-bottom: 1px solid #322;
                padding: 2px 4px;
                width: 7cm;
            }
            input:focus {
                outline: none;
            }

            @media (max-width: 15cm) {
                form {
                    justify-content: center;
                    padding: 0 1cm;
                    width: 100%;
                    box-sizing: border-box;
                }
                input {
                    flex: 1 1 0;
                }
            }
        `}</style>
    </form>
);


export default SearchBox;
