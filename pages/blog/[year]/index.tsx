import {NextPage} from 'next';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

import posts, {PageData} from '../../../lib/posts';

import MetaData from '../../../components/MetaData';
import Article from '../../../components/Article';
import SearchBar from '../../../components/SearchBar';
import BlogList from '../../../components/BlogList';
import ErrorPage from '../../_error';


export type Props = {
    year: number,
    posts: PageData[],
};


const YearIndex: NextPage<Props> = ({year, posts}) => {
    if (!year || !posts) {
        return <ErrorPage statusCode={404} />;
    }

    return (<>
        <MetaData title={`${year}年の記事`} />

        <SearchBar />

        <Article title={`${year}年の記事`} breadlist={[{
            title: 'blog',
            href: '/blog',
        }, {
            title: '2020',
            href: '/blog/[year]',
            as: `/blog/${year}`,
        }]}>
            <BlogList posts={posts} />
        </Article>
    </>);
};


export const unstable_getStaticProps = async ({params}: {params: {year: string}}) => {
    const year = Number(params.year);

    const ps = (await import('../../api')).posts.filter(x => x.pubtime.getFullYear() === year).map(x => ({
        title: x.title,
        href: x.href,
        pubtime: x.pubtime,
        tags: x.tags,
        description: x.description,
    }));

    return {
        props: {
            year: year,
            posts: ps,
        },
    };
};


export const unstable_getStaticPaths = async () => {
    const ps = (await import('../../api')).posts;

    const years = Array.from(new Set(ps.map(x => x.pubtime.getFullYear())));

    return {
        paths: years.map(y => ({params: {year: String(y)}})),
    };
};


export default YearIndex;
