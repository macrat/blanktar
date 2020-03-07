import {NextPage} from 'next';
import Link from 'next/link';

import posts, {PageData} from '../../../../lib/posts';

import Article from '../../../../components/Article';
import SearchBar from '../../../../components/SearchBar';
import DateTime from '../../../../components/DateTime';
import JsonLD from '../../../../components/JsonLD';
import ErrorPage from '../../../_error';


export type Props = {
    year: number,
    month: number,
    posts: PageData[],
};


const MonthIndex: NextPage<Props> = ({year, month, posts}) => {
    if (!year || !month || !posts) {
        return <ErrorPage statusCode={404} />;
    }

    return (<>
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

            <JsonLD data={{
                '@type': 'ItemList',
                itemListElement: posts.map(({href}, i) => ({
                    '@type': 'ListItem',
                    position: i + 1,
                    url: 'https://blanktar.jp' + href,
                })),
            }} />
        </Article>

        <style jsx>{`
            li {
                margin: 3mm 0;
            }
        `}</style>
    </>);
};


export const unstable_getStaticProps = async ({params}: {params: {year: string, month: string}}) => {
    const year = Number(params.year);
    const month = Number(params.month);

    const ps = (await import('../../../api')).posts.filter(x => x.pubtime.getFullYear() === year && x.pubtime.getMonth() + 1 === month).map(x => ({
        title: x.title,
        href: x.href,
        pubtime: x.pubtime,
    }));

    return {
        props: {
            year: year,
            month: month,
            posts: ps,
        },
    };
};


export const unstable_getStaticPaths = async () => {
    const ps = (await import('../../../api')).posts;

    const pages = Array.from(new Set(ps.map(x => (
        `${x.pubtime.getFullYear()}/${String(x.pubtime.getMonth() + 1).padStart(2, '0')}`
    ))));

    return {
        paths: pages.map(x => ({
            params: {
                year: String(x.split('/')[0]),
                month: String(x.split('/')[1]),
            },
        })),
    };
};


export default MonthIndex;
