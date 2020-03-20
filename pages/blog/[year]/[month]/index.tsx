import {NextPage} from 'next';
import Link from 'next/link';

import posts from '../../../../lib/server/posts';

import MetaData from '../../../../components/MetaData';
import Article from '../../../../components/Article';
import BlogList, {Props as BlogListProps} from '../../../../components/BlogList';
import ErrorPage from '../../../_error';


export type Props = BlogListProps & {
    year: number,
    month: number,
};


const MonthIndex: NextPage<Props> = ({year, month, posts}) => {
    return (<>
        <MetaData title={`${year}年${month}月の記事`} />

        <Article title={`${year}年${month}月の記事`} breadlist={[{
            title: 'blog',
            href: '/blog',
        }, {
            title: `${year}`,
            href: '/blog/[year]',
            as: `/blog/${year}`,
            description: `${year}年の記事`,
        }, {
            title: `${String(month).padStart(2, '0')}`,
            href: '/blog/[year]/[month]',
            as: `/blog/${year}/${String(month).padStart(2, '0')}`,
            description: `${month}月の記事`,
        }]}>

            <BlogList posts={posts} />
        </Article>
    </>);
};


export const getStaticProps = async ({params}: {params: {year: string, month: string}}) => {
    const year = Number(params.year);
    const month = Number(params.month);

    const ps = posts.filter(x => x.pubtime.getFullYear() === year && x.pubtime.getMonth() + 1 === month).map(x => ({
        title: x.title,
        href: x.href,
        pubtime: x.pubtime.toISOString(),
        tags: x.tags,
        description: x.description,
    }));

    return {
        props: {
            year: year,
            month: month,
            posts: ps,
        },
    };
};


export const getStaticPaths = async () => {
    const pages = Array.from(new Set(posts.map(x => (
        `${x.pubtime.getFullYear()}/${String(x.pubtime.getMonth() + 1).padStart(2, '0')}`
    ))));

    return {
        fallback: false,
        paths: pages.map(x => ({
            params: {
                year: String(x.split('/')[0]),
                month: String(x.split('/')[1]),
            },
        })),
    };
};


export default MonthIndex;
