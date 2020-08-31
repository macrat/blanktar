import React, { FC } from 'react';

import MetaData from '~/components/MetaData';
import Header from '~/components/Header';
import SearchBar from '~/components/SearchBar';
import Article from '~/components/Article';
import ComponentsProvider from './components';


export type Props = {
    frontMatter: {
        title: string;
        description: string | null;
        breadlist: {
            title: string;
            href: string;
            as?: string;
        }[];
        amp: boolean | 'hybrid';
    };
};


const SinglePageLayout: FC<Props> = ({ children, frontMatter: { title, description, breadlist } }) => {
    return (<>
        <Header />

        <SearchBar />

        <Article title={title} breadlist={breadlist}>
            <MetaData title={title} description={description ?? undefined} />

            <ComponentsProvider>
                {children}
            </ComponentsProvider>
        </Article>
    </>);
};


export default SinglePageLayout;
