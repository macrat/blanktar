import {NextPage} from 'next';
import Link from 'next/link';

import posts from '~/lib/posts';

import MetaData from '~/components/MetaData';
import Article from '~/components/Article';
import BlogList, {Props as BlogListProps} from '~/components/BlogList';
import ErrorPage from '~/pages/_error';


export type Props = BlogListProps & {
    year: number,
};


const YearIndex: NextPage<Props> = ({year, posts}) => {
    return (<>
        <MetaData
            title={`${year}年の記事`}
            description={`Blanktarの${year}年の記事一覧。「${posts[0]?.title}」${posts.length > 1 ? `「${posts[1]?.title}」` : ""}ほか${posts.length}件。`} />

        <Article title={`${year}年の記事`} breadlist={[{
            title: 'blog',
            href: '/blog',
        }, {
            title: `${year}`,
            href: '/blog/[year]',
            as: `/blog/${year}`,
            description: `${year}年の記事`,
        }]}>
            <BlogList posts={posts} />
        </Article>
    </>);
};


export const getStaticProps = async ({params}: {params: {year: string}}) => {
    const year = Number(params.year);

    const ps = posts.filter(x => x.year === year).map(x => ({
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


export const getStaticPaths = async () => {
    const years = Array.from(new Set(posts.map(x => x.year)));

    return {
        fallback: false,
        paths: years.map(y => ({params: {year: String(y)}})),
    };
};


export default YearIndex;
