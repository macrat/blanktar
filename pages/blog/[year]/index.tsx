import {NextPage} from 'next';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch';

import posts, {PageData} from '../../../lib/posts';

import Article from '../../../components/Article';
import SearchBar from '../../../components/SearchBar';
import DateTime from '../../../components/DateTime';
import JsonLD from '../../../components/JsonLD';
import ErrorPage from '../../_error';


export type Props = {
    year: number,
    posts: PageData[],
};


const YearIndex: NextPage<Props> = ({year, posts}) => {
    if (!year || !posts) {
        return <ErrorPage statusCode={404} />;
    }

    return (<>
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


export const unstable_getStaticProps = async ({params}: {params: {year: string}}) => {
    const year = Number(params.year);

    const ps = (await import('../../api')).posts.filter(x => x.pubtime.getFullYear() === year).map(x => ({
        title: x.title,
        href: x.href,
        pubtime: x.pubtime,
    }));

    return {
        props: {
            year: year,
            posts: ps,
        },
    };
};


export const unstable_getStaticPaths = async () => {
    const ps = (await import('../../api')).posts;

    const years = Array.from(new Set(ps.map(x => x.pubtime.getFullYear())));

    return {
        paths: years.map(y => ({params: {year: String(y)}})),
    };
};


export default YearIndex;
