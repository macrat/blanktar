import {NextPage, GetServerSideProps} from 'next';

import posts from '../../lib/server/posts';

import MetaData from '../../components/MetaData';
import Article from '../../components/Article';
import BlogList, {Props as BlogListProps} from '../../components/BlogList';
import Pagination from '../../components/Pagination';


export const config = {
    amp: 'hybrid',
};


export type Props = BlogListProps & {
    page: number,
    totalPages: number,
};


const BlogIndex: NextPage<Props> = ({posts, page, totalPages}) => (
    <>
        <MetaData title="blog" />

        <Article title="blog" breadlist={[{
            title: 'blog',
            href: '/blog',
        }]}>

            <BlogList posts={posts} />

            <Pagination
                current={page}
                total={totalPages}
                href={p => ({pathname: '/blog', query: p > 1 ? {page: p} : undefined})} />
        </Article>
    </>
);


export const getServerSideProps: GetServerSideProps = async ({query}) => {
    const page = Math.max(1, Number(String(query.page ?? 1)));

    return {
        props: {
            page: page,
            totalPages: Math.ceil(posts.length / 10),
            posts: posts.reverse().slice((page - 1) * 10, page * 10).map(p => ({
                title: p.title,
                href: p.href,
                pubtime: p.pubtime.toISOString(),
                tags: p.tags,
                description: p.description,
            })),
        },
    };
};


export default BlogIndex;
