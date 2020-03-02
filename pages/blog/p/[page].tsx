import {NextPage} from 'next';
import Link from 'next/link';

import posts, {PageData} from '../../../lib/posts';

import Article from '../../../components/Article';
import SearchBar from '../../../components/SearchBar';
import DateTime from '../../../components/DateTime';
import Pagination from '../../../components/Pagination';


export type Props = {
    page: number,
    totalPages: number,
    posts: PageData[],
};


const BlogIndex: NextPage<Props> = ({posts, page, totalPages}) => (
    <>
        <SearchBar />

        <Article title="blog index" breadlist={[{
            title: 'blog',
            href: '/blog',
        }]}>
            <ol>
                {posts.map(({href, title, pubtime}) => (
                    <li key={href}><Link href={href}><a>
                        <DateTime dateTime={new Date(pubtime)} /><br />
                        <span>{title}</span>
                    </a></Link></li>
                ))}
            </ol>

            <Pagination
                current={page}
                total={totalPages}
                href={p => p === 0 ? "/blog" : "/blog/p/[page]"}
                as={p => p === 0 ? undefined : `/blog/p/${p}`} />
        </Article>

        <style jsx>{`
            li {
                margin: 3mm 0;
            }
        `}</style>
    </>
);


BlogIndex.getInitialProps = async ({req, query}) => {
    const page = Number(String(query.page ?? 0));
    const resp = await posts(req?.headers?.host, {
        page: page,
        limit: 5,
    });

    const totalPages = Math.ceil(resp.totalCount / 5);

    return {
        page: page,
        totalPages: totalPages,
        posts: resp.posts,
    };
};


export default BlogIndex;
