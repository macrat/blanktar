import {NextPage} from 'next';
import Link from 'next/link';

import posts from '../../../../lib/posts';

import Article from '../../../../components/Article';
import SearchBar from '../../../../components/SearchBar';


const MonthIndex: NextPage<{year: number, month: number}> = ({year, month}) => (
    <>
        <SearchBar />

        <Article title={`${year}年${month}月の記事`} breadlist={[{
            title: 'blog',
            href: '/blog',
        }, {
            title: `${year}`,
            href: '/blog/[year]',
            as: `/blog/${year}`,
        }, {
            title: `${String(month).padStart(2, '0')}`,
            href: '/blog/[year]/[month]',
            as: `/blog/${year}/${String(month).padStart(2, '0')}`,
        }]}>

            <ol>
                {posts(year, month).map(x => (
                    <li key={x}><Link href={`/blog/${year}/${String(month).padStart(2, '0')}/${x}`}><a>{x}</a></Link></li>
                ))}
            </ol>
        </Article>
    </>
);


MonthIndex.getInitialProps = ({query}) => {
    return {
        year: Number(String(query.year)),
        month: Number(String(query.month)),
    };
};


export default MonthIndex;
