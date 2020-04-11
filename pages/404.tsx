import React from 'react';
import {NextPage} from 'next';

import ErrorPage from '~/components/ErrorPage';


export type Props = {};


const NotFound: NextPage<Props> = () => (
    <ErrorPage
        statusCode={404}
        title="ページが見つかりません"
        message="サイト内検索をお試しください。" />
);


export default NotFound;
