import {FC} from 'react';
import {useRouter} from 'next/router';

import MetaData from '../components/MetaData';
import Article from '../components/Article';
import JsonLD, {Author, Publisher} from '../components/JsonLD';
import ComponentsProvider from './components';
import SocialShare from '../components/SocialShare';


type HowTo = {
    supply?: string[],
    tool?: string[],
    step: {
        name: string,
        text: string,
        image?: string,
    }[],
    totalTime?: string,
};


export type Props = {
    title: string,
    pubtime: string,
    modtime?: string,
    amp: boolean | 'hybrid',
    tags: string[],
    image?: string,
    description: string | null,
    howto?: HowTo,
};


export default ({title, pubtime, modtime, amp, tags, image, description, howto}: Props) => {
    if (!title) {
        throw `${pubtime}: title is not provided`;
    }
    if (!pubtime || !pubtime.match(/^20[0-9]{2}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):[0-5][0-9]\+0900$/)) {
        throw `${title}: pubtime is not provided or invalid format: "${pubtime}"`;
    }
    if (modtime && !modtime.match(/^20[0-9]{2}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])T([0-1][0-9]|2[0-3]):[0-5][0-9]\+0900$/)) {
        throw `${title}: modtime is not provided or invalid format: "${modtime}"`;
    }
    if (![true, false, 'hybrid'].includes(amp)) {
        throw `${title} ${pubtime}: amp is not provided or invalid value: "${amp}"`;
    }
    if (!tags || tags.length === 0) {
        throw `${title} ${pubtime}: tags is not provided`;
    }
    if (!description && description !== null) {
        throw `${title} ${pubtime}: description is not provided`;
    }

    const BlogArticle: FC<{}> = ({children}) => {
        const router = useRouter();
        const ptime = new Date(pubtime);

        return (
            <>
                <MetaData title={title} description={description || undefined} />

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
                        <SocialShare title={title} href={`https://blanktar.jp${router.asPath}`} />
                    </aside>

                    <JsonLD data={{
                        '@type': 'BlogPosting',
                        headline: title,
                        author: Author,
                        image: image ? `https://blanktar.jp${image}` : `https://blanktar.jp/img/eyecatch/${encodeURIComponent(title)}.png`,
                        datePublished: pubtime,
                        dateModified: modtime,
                        publisher: Publisher,
                        description: description || undefined,
                        mainEntityOfPage: 'https://blanktar.jp' + router.asPath,
                    }} />
                    {howto ? (
                        <JsonLD data={{
                            '@type': 'HowTo',
                            name: title,
                            description: description || undefined,
                            totalTime: howto?.totalTime,
                            supply: howto?.supply?.map(x => ({
                                '@type': 'HowToSupply',
                                name: x,
                            })),
                            tool: howto?.tool?.map(x => ({
                                '@type': 'HowToTool',
                                name: x,
                            })),
                            step: howto?.step?.map(x => ({
                                '@type': 'HowToStep',
                                name: x.name,
                                text: x.text,
                                image: image ? 'https://blanktar.jp' + image : undefined,
                            })),
                            url: 'https://blanktar.jp' + router.asPath,
                            image: image ? 'https://blanktar.jp' + image : undefined,
                        }} />
                    ) : null}
                </Article>

                <style jsx>{`
                    aside {
                        margin-top: 1cm;
                    }
                `}</style>
            </>
        );
    };

    return BlogArticle;
};
