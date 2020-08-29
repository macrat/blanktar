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


const SinglePageLayout = ({ frontMatter: { title, description, breadlist, amp } }: Props) => {
    if (!title) {
        throw new Error(`title is not provided: ${breadlist[breadlist.length - 1].title}`);
    }
    if (![true, false, 'hybrid'].includes(amp)) {
        throw new Error(`${title}: amp is not provided or invalid value: "${amp}"`);
    }
    if (!description && description !== null) {
        throw new Error(`${title}: description is not provided`);
    }

    const SinglePage: FC = ({ children }) => (<>
        <Header />

        <SearchBar />

        <Article title={title} breadlist={breadlist}>
            <MetaData title={title} description={description ?? undefined} />

            <ComponentsProvider>
                {children}
            </ComponentsProvider>
        </Article>
    </>);

    return SinglePage;
};


export default SinglePageLayout;
