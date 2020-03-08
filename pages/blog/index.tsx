import {NextPage} from 'next';

import posts, {PageData} from '../../lib/posts';

import MetaData from '../../components/MetaData';
import Article from '../../components/Article';
import SearchBar from '../../components/SearchBar';
import BlogList from '../../components/BlogList';
import Pagination from '../../components/Pagination';


export const config = {
    amp: 'hybrid',
};


export type Props = {
    page: number,
    totalPages: number,
    posts: PageData[],
};


const BlogIndex: NextPage<Props> = ({posts, page, totalPages}) => (
    <>
        <MetaData title="blog" />

        <SearchBar />

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


BlogIndex.getInitialProps = async ({req, query}) => {
    const page = Math.max(1, Number(String(query.page ?? 1)));

    const resp = await posts(req?.headers?.host, {
        page: page - 1,
        desc: true,
        limit: 10,
    });

    const totalPages = Math.ceil(resp.totalCount / 10);

    return {
        page: page,
        totalPages: totalPages,
        posts: resp.posts,
    };
};


export default BlogIndex;
