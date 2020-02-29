import {NextPage} from 'next';
import Link from 'next/link';

import posts from '../../../../lib/posts';

import Article from '../../../../components/Article';
import SearchBox from '../../../../components/SearchBox';


const MonthIndex: NextPage<{year: number, month: number}> = ({year, month}) => (
    <>
        <SearchBox />

        <Article title={`${year}/${month}'s blog`} breadlist={[{
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
