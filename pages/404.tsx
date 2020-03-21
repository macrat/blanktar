import {NextPage, GetStaticProps} from 'next';

import ErrorPage from '../components/ErrorPage';


export type Props = {
    __disableSearchBar: true,
};


const NotFound: NextPage<Props> = ({}) => (
    <ErrorPage
        statusCode={404}
        title="ページが見つかりません"
        message="サイト内検索をお試しください。" />
);


export const getStaticProps: GetStaticProps<Props> = async () => ({
    props: {
        __disableSearchBar: true,
    },
});


export default NotFound;
