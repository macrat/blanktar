import {FC} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';

import SearchBar from '../components/SearchBar';
import Article from '../components/Article';
import ComponentsProvider from './components';


export type Props = {
    title: string,
    pubtime: string,
    amp: boolean | 'hybrid',
    tags: string[],
    image?: string,
    description: string | null,
};


export default ({title, pubtime, amp, tags, image, description}: Props) => {
    if (!title) {
        throw `${pubtime}: title is not provided`;
    }
    if (!pubtime || !pubtime.match(/^20[0-9]{2}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):[0-5][0-9]\+0900$/)) {
        throw `${title}: pubtime is not provided or invalid format: "${pubtime}"`;
    }
    if (![true, false, 'hybrid'].includes(amp)) {
        throw `${title} ${pubtime}: amp is not provided or invalid value: "${amp}"`;
    }
    if (!tags || tags.length === 0) {
        throw `${title} ${pubtime}: tags is not provided`;
    }
    if (!description && description !== null) {
        throw `${title} ${pubtime}: description is not provided`;
    }

    const BlogArticle: FC<{}> = ({children}) => {
        const router = useRouter();
        const ptime = new Date(pubtime);

        return (
            <>
                <Head>
                    <title>{title} - Blanktar</title>
                    {description ? <meta name="description" content={description} /> : null}
                </Head>

                <SearchBar />

                <Article
                    title={title}
                    pubtime={ptime}
                    tags={tags}
                    breadlist={[{
                        title: 'blog',
                        href: '/blog',
                    }, {
                        title: `${ptime.getFullYear()}`,
                        href: '/blog/[year]',
                        as: `/blog/${ptime.getFullYear()}`,
                    }, {
                        title: `${String(ptime.getMonth() + 1).padStart(2, '0')}`,
                        href: '/blog/[year]/[month]',
                        as: `/blog/${ptime.getFullYear()}/${String(ptime.getMonth() + 1).padStart(2, '0')}`,
                    }, {
                        title: title,
                        href: router.asPath,
                    }]}>

                    <ComponentsProvider>
                        {children}
                    </ComponentsProvider>
                </Article>
            </>
        );
    };

    return BlogArticle;
};
