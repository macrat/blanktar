import {NextPage} from 'next';
import Link from 'next/link';

import posts, {PageData} from '../../../lib/posts';

import Article from '../../../components/Article';
import SearchBar from '../../../components/SearchBar';
import DateTime from '../../../components/DateTime';


export type Props = {
    year: number,
    posts: PageData[],
};


const YearIndex: NextPage<Props> = ({year, posts}) => (
    <>
        <SearchBar />

        <Article title={`${year}年の記事`} breadlist={[{
            title: 'blog',
            href: '/blog',
        }, {
            title: '2020',
            href: '/blog/[year]',
            as: `/blog/${year}`,
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


YearIndex.getInitialProps = async ({req, query}) => {
    const year = Number(String(query.year));

    return {
        year: year,
        posts: await posts(req?.headers?.host, year),
    };
};


export default YearIndex;
