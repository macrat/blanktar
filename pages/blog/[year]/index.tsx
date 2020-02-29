import {NextPage} from 'next';
import Link from 'next/link';

import posts from '../../../lib/posts';

import Article from '../../../components/Article';
import SearchBar from '../../../components/SearchBar';


const YearIndex: NextPage<{year: number}> = ({year}) => (
    <>
        <SearchBar />

        <Article title={`${year}'s blog`} breadlist={[{
            title: 'blog',
            href: '/blog',
        }, {
            title: '2020',
            href: '/blog/[year]',
            as: `/blog/${year}`,
        }]}>
            <ol>
                {posts(year).map(x => (
                    <li key={x}><Link href="/blog/[year]/[month]" as={`/blog/${year}/${x}`}><a>{x}</a></Link></li>
                ))}
            </ol>
        </Article>
    </>
);


YearIndex.getInitialProps = ({query}) => {
    return {year: Number(String(query.year))};
};


export default YearIndex;
