import { FC } from 'react';
import { useRouter } from 'next/router';

import MetaData from '~/components/MetaData';
import Header from '~/components/Header';
import SearchBar from '~/components/SearchBar';
import Article from '~/components/Article';
import JsonLD, { Author, Publisher } from '~/components/JsonLD';
import ComponentsProvider from './components';
import SocialShare from '~/components/SocialShare';


type HowTo = {
    name?: string;
    description?: string;
    supply?: string[];
    tool?: string[];
    step: {
        name: string;
        text: string;
        url?: string;
        image?: string;
    }[];
    totalTime?: string;
};


type FAQ = {
    question: string;
    answer: string;
}[];


export type Props = {
    frontMatter: {
        title: string;
        pubtime: string;
        modtime?: string;
        amp: boolean | 'hybrid';
        tags?: string[];
        image?: string | string[];
        description: string | null;
        howto?: HowTo;
        faq?: FAQ;
    };
};


const BlogArticleLayout: FC<Props> = ({ children, frontMatter: { title, pubtime, modtime, tags, image, description, howto, faq } }) => {
    const router = useRouter();
    const ptime = new Date(pubtime.replace('+0900', '+09:00'));

    return (
        <>
            <MetaData title={title} description={description ?? undefined} image={typeof image === 'string' ? image : image?.[0]} />

            <Header />

            <SearchBar />

            <Article
                title={title}
                pubtime={ptime}
                tags={tags}
                breadlist={[{
                    title: 'blog',
                    href: '/blog',
                }, {
                    title: `${ptime.getFullYear()}`,
                    href: '/blog/[year]',
                    as: `/blog/${ptime.getFullYear()}`,
                    description: `${ptime.getFullYear()}年の記事`,
                }, {
                    title: `${String(ptime.getMonth() + 1).padStart(2, '0')}`,
                    href: '/blog/[year]/[month]',
                    as: `/blog/${ptime.getFullYear()}/${String(ptime.getMonth() + 1).padStart(2, '0')}`,
                    description: `${ptime.getMonth()+1}月の記事`,
                }, {
                    title: title,
                    href: router.asPath,
                }]}>

                <ComponentsProvider>
                    {children}
                </ComponentsProvider>

                <aside>
                    <SocialShare title={title} href={`https://blanktar.jp${router.asPath}`} image={image} />

                    <style jsx>{`
                        margin-top: 1cm;
                    `}</style>
                </aside>

                <JsonLD data={{
                    '@type': 'BlogPosting',
                    headline: title,
                    author: Author,
                    image: (
                        (typeof image === 'string') ? (
                            `https://blanktar.jp${image}`
                        ) : image ? (
                            image.map(x => `https://blanktar.jp${x}`)
                        ) : [
                            `https://blanktar.jp/img/eyecatch/1x1/${encodeURIComponent(title)}.png`,
                            `https://blanktar.jp/img/eyecatch/4x3/${encodeURIComponent(title)}.png`,
                            `https://blanktar.jp/img/eyecatch/16x9/${encodeURIComponent(title)}.png`,
                        ]
                    ),
                    datePublished: pubtime,
                    dateModified: modtime ?? pubtime,
                    publisher: Publisher,
                    description: description ?? undefined,
                    mainEntityOfPage: 'https://blanktar.jp' + router.pathname,
                }} />
                {howto ? (
                    <JsonLD data={{
                        '@type': 'HowTo',
                        name: howto.name ?? title,
                        description: howto.description ?? description ?? undefined,
                        totalTime: howto.totalTime,
                        supply: howto.supply?.map(x => ({
                            '@type': 'HowToSupply',
                            name: x,
                        })) ?? [],
                        tool: howto.tool?.map(x => ({
                            '@type': 'HowToTool',
                            name: x,
                        })) ?? [],
                        step: howto.step.map(({ name, text, url, image: stepImage }) => ({
                            '@type': 'HowToStep',
                            name: name,
                            text: text,
                            url: url?.startsWith('/') ? `https://blanktar.jp${url}` : url?.startsWith('#') ? `https://blanktar.jp${router.asPath}${url}` : url,
                            image: stepImage ? 'https://blanktar.jp' + stepImage : undefined,
                        })),
                        url: 'https://blanktar.jp' + router.asPath,
                        image: image ? 'https://blanktar.jp' + image : undefined,
                    }} />
                ) : null}
                {faq ? (
                    <JsonLD data={{
                        '@type': 'FAQPage',
                        mainEntity: faq.map(x => ({
                            '@type': 'Question',
                            name: x.question,
                            acceptedAnswer: {
                                '@type': 'Answer',
                                text: x.answer,
                            },
                        })),
                    }} />
                ) : null}
            </Article>
        </>
    );
};


export default BlogArticleLayout;
