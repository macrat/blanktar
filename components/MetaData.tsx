import {FC} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';


export type Props = {
    title?: string,
    description?: string,
    image?: string,
};


const MetaData: FC<Props> = ({title, description, image}) => {
    const router = useRouter();

    return (
        <Head>
            <title>{title ? `${title} - Blanktar` : 'Blanktar'}</title>
            {description ? <meta name="description" content={description} /> : null}

            <meta property="og:title" content={title || 'Blanktar'} key="ogp--title" />
            <meta property="og:type" content={router.asPath.startsWith('/blog') ? 'blog' : (router.asPath === '/' ? 'website' : 'article')} key="ogp--type" />
            <meta property="og:url" content={`https://blanktar.jp${router.asPath}`} key="ogp--url" />
            <meta property="og:image" content={image ? `https://blanktar.jp${image}` : (title ? `https://blanktar.jp/api/eyecatch/${encodeURIComponent(title)}` : "https://blanktar.jp/img/social-preview.png")} key="ogp--image" />
            {description ? <meta property="og:description" content={description} key="ogp-description" /> : null}
            <meta property="og:site_name" content="Blanktar" key="ogp--site_name" />
            <meta property="fb:app_id" content="3557706767604040" key="facebook--app_id" />
            <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} key="twitter--card" />
            <meta name="twitter:creator" content="@macrat_jp" key="twitter-creator" />

            <link rel="canonical" type="text/html" href={`https://blanktar.jp${router.asPath}`} />
        </Head>
    );
};


export default MetaData;
