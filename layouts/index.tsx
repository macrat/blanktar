import {FC} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';

import SearchBar from '../components/SearchBar';
import Article from '../components/Article';
import ComponentsProvider from './components';


export type Props = {
    title: string,
    pubtime: string,
    tags: string[],
    image?: string,
    description?: string,
};


export default ({title, pubtime, tags, image, description}: Props) => {
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
