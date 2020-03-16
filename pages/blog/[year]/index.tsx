import {NextPage} from 'next';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

import {PageData} from '../../../lib/posts';
import posts from '../../../lib/server/posts';

import MetaData from '../../../components/MetaData';
import Article from '../../../components/Article';
import BlogList from '../../../components/BlogList';
import ErrorPage from '../../_error';


export type Props = {
    year: number,
    posts: PageData[],
};


const YearIndex: NextPage<Props> = ({year, posts}) => {
    return (<>
        <MetaData title={`${year}年の記事`} />

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


export const getStaticProps = async ({params}: {params: {year: string}}) => {
    const year = Number(params.year);

    const ps = posts.filter(x => x.pubtime.getFullYear() === year).map(x => ({
        title: x.title,
        href: x.href,
        pubtime: x.pubtime.toISOString(),
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


export const getStaticPaths = async () => {
    const years = Array.from(new Set(posts.map(x => x.pubtime.getFullYear())));

    return {
        fallback: false,
        paths: years.map(y => ({params: {year: String(y)}})),
    };
};


export default YearIndex;
