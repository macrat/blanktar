import Link from 'next/link';

import posts from '../../lib/posts';

import Article from '../../components/Article';
import SearchBar from '../../components/SearchBar';


const BlogIndex = () => (
    <>
        <SearchBar />

        <Article title="blog index" breadlist={[{
            title: 'blog',
            href: '/blog',
        }]}>
            <ol>
                {posts().map(x => (
                    <li key={x}><Link href="/blog/[year]" as={`/blog/${x}`}><a>{x}</a></Link></li>
                ))}
            </ol>
        </Article>
    </>
);


export default BlogIndex;
