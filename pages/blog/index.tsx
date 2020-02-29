import Link from 'next/link';

import posts from '../../lib/posts';

import Article from '../../components/Article';
import SearchBox from '../../components/SearchBox';


const BlogIndex = () => (
    <>
        <SearchBox />

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
