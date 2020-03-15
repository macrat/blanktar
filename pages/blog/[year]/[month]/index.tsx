import {NextPage} from 'next';
import Link from 'next/link';

import posts, {PageData} from '../../../../lib/posts';

import MetaData from '../../../../components/MetaData';
import Article from '../../../../components/Article';
import BlogList from '../../../../components/BlogList';
import ErrorPage from '../../../_error';


export type Props = {
    year: number,
    month: number,
    posts: PageData[],
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
        }, {
            title: `${String(month).padStart(2, '0')}`,
            href: '/blog/[year]/[month]',
            as: `/blog/${year}/${String(month).padStart(2, '0')}`,
        }]}>

            <BlogList posts={posts} />
        </Article>
    </>);
};


export const getStaticProps = async ({params}: {params: {year: string, month: string}}) => {
    const year = Number(params.year);
    const month = Number(params.month);

    const ps = (await import('../../../api')).posts.filter(x => x.pubtime.getFullYear() === year && x.pubtime.getMonth() + 1 === month).map(x => ({
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
    const ps = (await import('../../../api')).posts;

    const pages = Array.from(new Set(ps.map(x => (
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
