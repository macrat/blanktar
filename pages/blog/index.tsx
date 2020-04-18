import React from 'react';
import {NextPage, GetServerSideProps} from 'next';

import posts from '~/lib/posts';

import NotFound from '../404';
import MetaData from '~/components/MetaData';
import Header from '~/components/Header';
import SearchBar from '~/components/SearchBar';
import Article from '~/components/Article';
import BlogList, {Props as BlogListProps} from '~/components/BlogList';
import Pagination from '~/components/Pagination';


export const config = {
    amp: 'hybrid',
};


export type Props = BlogListProps & {
    page: number;
    totalPages: number;
};


const BlogIndex: NextPage<Props> = ({posts, page, totalPages}) => (
    posts.length === 0 ? (
        <NotFound />
    ) : (<>
        <MetaData
            title="blog"
            description={`Blanktarのブログ記事一覧の${totalPages}ページ中${page}ページ目。「${posts[0]?.title}」「${posts[1]?.title}」ほか${posts.length}件。`} />

        <Header />

        <SearchBar />

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
    </>)
);


export const getServerSideProps: GetServerSideProps<Props> = async ({res, query}) => {
    const offset = Number(String(query.offset ? query.offset : 0));

    const ps = posts.slice(Math.max(0, offset), Math.max(0, offset + 10)).map(p => ({
        title: p.title,
        href: p.href,
        pubtime: p.pubtime,
        tags: p.tags,
        description: p.description,
    }));

    if (ps.length <= 0) {
        res.statusCode = 404;

        return {
            props: {
                page: 0,
                totalPages: 0,
                posts: [],
            },
        };
    }

    return {
        props: {
            page: Math.ceil((offset+1) / 10),
            totalPages: Math.ceil(posts.length / 10),
            posts: ps,
        },
    };
};


export default BlogIndex;
