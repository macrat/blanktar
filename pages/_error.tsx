import {NextPage} from 'next';

import SearchBox from '../components/SearchBar/SearchBox';


export type Props = {
    statusCode: number,
};


const Error: NextPage<Props> = ({statusCode}) => (
    <article>
        <header>
            <h1>{statusCode}</h1>

            <span>{statusCode === 404 ? (<>
                ページが見つかりませんでした<br />
                サイト内検索をお試しください。
            </>) : statusCode === 500 ? (<>
                サーバーでエラーが発生しました<br />
                しばらくしてからもう一度お試しください。
            </>) : (<>
                エラーが発生しました
            </>)}</span>
        </header>

        <div>
            <SearchBox />
        </div>

        <style jsx>{`
            header {
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 1cm 5mm;
            }
            h1 {
                font-size: 16mm;
                font-weight: 1;
                margin: 0 5mm 0 0;
                padding: 0 5mm 0 0;
                border-right: .2mm solid var(--colors-fg);
            }
            div {
                width: 15cm;
                max-width: calc(100% - 2cm);
                margin: 2cm auto;
                padding: 0 1cm;
            }
        `}</style>
    </article>
);


Error.getInitialProps = ({res, err}) => {
    return {
        statusCode: res?.statusCode ?? err?.statusCode ?? 404,
    };
};


export default Error;
