import {NextPage, GetServerSideProps} from 'next';

import posts from '~/lib/posts';

import MetaData from '~/components/MetaData';
import Article from '~/components/Article';
import BlogList, {Props as BlogListProps} from '~/components/BlogList';
import Pagination from '~/components/Pagination';


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
                href={p => ({
                    pathname: '/blog',
                    query: p > 1 ? {offset: (p-1) * 10} : undefined,
                })} />
        </Article>
    </>
);


export const getServerSideProps: GetServerSideProps = async ({res, query}) => {
    const offset = Number(String(query.offset ?? 0));

    return {
        props: {
            page: Math.ceil((offset+1) / 10),
            totalPages: Math.ceil(posts.length / 10),
            posts: posts.slice(Math.max(0, offset), Math.max(0, offset + 10)).map(p => ({
                title: p.title,
                href: p.href,
                pubtime: p.pubtime,
                tags: p.tags,
                description: p.description,
            })),
        },
    };
};


export default BlogIndex;
