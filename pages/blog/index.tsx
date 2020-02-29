import Link from 'next/link';

import posts from '../../lib/posts';

import Article from '../../components/Article';


const BlogIndex = () => (
    <Article title="blog index">
        <ol>
            {posts().map(x => (
                <li key={x}><Link href={`/blog/${x}`}><a>{x}</a></Link></li>
            ))}
        </ol>
    </Article>
);


export default BlogIndex;
