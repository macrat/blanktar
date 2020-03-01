import {NextPage} from 'next';
import Link from 'next/link';

import posts, {PageData} from '../../lib/posts';

import Article from '../../components/Article';
import SearchBar from '../../components/SearchBar';
import DateTime from '../../components/DateTime';


export type Props = {
    posts: PageData[],
};


const BlogIndex: NextPage<Props> = ({posts}) => (
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
        </Article>

        <style jsx>{`
            li {
                margin: 3mm 0;
            }
        `}</style>
    </>
);


BlogIndex.getInitialProps = async ({req}) => ({
    posts: await posts(req?.headers?.host),
});


export default BlogIndex;
