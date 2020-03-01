import {NextPage} from 'next';
import Link from 'next/link';

import posts, {PageData} from '../../../../lib/posts';

import Article from '../../../../components/Article';
import SearchBar from '../../../../components/SearchBar';
import DateTime from '../../../../components/DateTime';


export type Props = {
    year: number,
    month: number,
    posts: PageData[],
};


const MonthIndex: NextPage<Props> = ({year, month, posts}) => (
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


MonthIndex.getInitialProps = async ({req, query}) => {
    const year = Number(String(query.year));
    const month = Number(String(query.month));

    return {
        year: year,
        month: month,
        posts: await posts(req?.headers?.host, year, month),
    };
};


export default MonthIndex;
