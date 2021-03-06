import { FC } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { getImageURL } from '~/lib/eyecatch';


export type Props = {
    title?: string;
    description?: string;
    image?: string;
};


const MetaData: FC<Props> = ({ title, description, image }) => {
    const router = useRouter();

    const query = new URLSearchParams(
        Object.entries(router.query)
            .filter(([k, v]) => k !== 'amp' && v)
            .map(([k, v]) => [k, String(v)])
    );
    const canonical = new URL(`https://blanktar.jp${router.pathname}${String(query) ? "?" + query : ""}`);

    return (
        <Head>
            <title>{title ? `${title} - Blanktar` : 'Blanktar'}</title>
            {description ? <meta name="description" content={description} key="meta--description" /> : null}

            <meta property="og:title" content={title ?? 'Blanktar'} key="ogp--title" />
            <meta property="og:type" content={router.asPath === '/' ? 'website' : 'article'} key="ogp--type" />
            <meta property="og:url" content={`${canonical}`} key="ogp--url" />
            <meta property="og:image" content={getImageURL(title, image)} key="ogp--image" />
            {description ? <meta property="og:description" content={description} key="ogp-description" /> : null}
            <meta property="og:site_name" content="Blanktar" key="ogp--site_name" />
            <meta property="fb:app_id" content="3557706767604040" key="facebook--app_id" />
            <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} key="twitter--card" />
            <meta name="twitter:creator" content="@macrat_jp" key="twitter--creator" />

            {image ? <meta name="robots" content="max-image-preview:large" key="robots--max-image-preview" /> : null}

            <link rel="canonical" type="text/html" href={`${canonical}`} key="link--canonical" />
        </Head>
    );
};


export default MetaData;
