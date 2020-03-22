import {NextPage} from 'next';

import ErrorPage from '~/components/ErrorPage';


export type Props = {
    statusCode: number,
    __disableSearchBar: true,
};


type MessageSet = {
    [key: number]: string,
    default: string,
};


const titles: MessageSet = {
    404: "ページが見つかりません",
    500: "サーバでエラーが発生しました",
    default: "エラーが発生しました",
};


const messages: MessageSet = {
    400: "不正なリクエストです。",
    405: "そのメソッドは受け付けられません。",
    404: "サイト内検索をお試しください。",
    500: "しばらくしてからもう一度お試しください。",
    default: "",
};


const Error: NextPage<Props> = ({statusCode}) => (
    <ErrorPage
        statusCode={statusCode}
        title={titles[statusCode] ?? titles.default}
        message={messages[statusCode] ?? messages.default} />
);


Error.getInitialProps = ({res, err}) => ({
    statusCode: res?.statusCode ?? err?.statusCode ?? 404,
    __disableSearchBar: true,
});


export default Error;
