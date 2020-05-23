import React from 'react';
import { NextPage } from 'next';

import ErrorPage from '~/components/ErrorPage';


const NotFound: NextPage = () => (
    <ErrorPage
        statusCode={404}
        title="ページが見つかりません"
        message="サイト内検索をお試しください。" />
);


export default NotFound;
