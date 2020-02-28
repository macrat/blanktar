import Link from 'next/link';

import posts from '../../lib/posts';


const BlogIndex = () => (
    <main>
        <h1>blog index</h1>

        <ol>
            {posts().map(x => (
                <li key={x}><Link href={`/blog/${x}`}><a>{x}</a></Link></li>
            ))}
        </ol>
    </main>
);


export default BlogIndex;
