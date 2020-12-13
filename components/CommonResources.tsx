import { FC, memo } from 'react';
import { useAmp } from 'next/amp';
import Head from 'next/head';

import JsonLD, { Website } from '~/components/JsonLD';


const CommonResources: FC = () => {
    const isAmp = useAmp();

    return (
        <Head>
            <meta charSet="utf-8" key="meta--charset" />

            <link
                rel="stylesheet"
                type="text/css"
                href={isAmp ? 'https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese' : "/font/font.css"}
                crossOrigin={isAmp ? "anonymous" : undefined}
                key="style--font" />

            {/* ヘッダーで必ず使うフォントを事前読み込みさせる */}
            {isAmp ? (<>
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                    key="preconnect--google-fonts" />
                <link
                    rel="preload"
                    as="font"
                    href="https://fonts.gstatic.com/s/notosansjp/v25/-F62fjtqLzI2JPCgQBnw7HFow2oe2EcP5pp0erwTqsSWs9Jezazjcb4.118.woff2"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="preload--font-a" />
                <link
                    rel="preload"
                    as="font"
                    href="https://fonts.gstatic.com/s/notosansjp/v25/-F6pfjtqLzI2JPCgQBnw7HFQaioq1xVxjfp_dakBof6Bs-tb3ab2FNISVac.118.woff2"
                    type="font/woff2"
                    crossOrigin="anonymous"
                    key="preload--font-b" />
            </>) : (<>
                <link
                    rel="preload"
                    as="font"
                    href="/font/5367eb202c3e.woff2"
                    type="font/woff2"
                    key="preload--font-a" />
                <link
                    rel="preload"
                    as="font"
                    href="/font/bbd38bec258b.woff2"
                    type="font/woff2"
                    key="preload--font-b" />
            </>)}

            {isAmp ? '' : (
                <script src="https://www.google-analytics.com/analytics.js" defer />
            )}

            <meta name="theme-color" content="#402020" />
            <link rel="manifest" href="/manifest.json" key="webmanifest" />
            <link rel="icon" sizes="any" type="image/svg+xml" href="/favicon.svg" key="favicon--svg" />
            <link rel="icon" sizes="512x512" type="image/png" href="/img/blanktar-logo@512.png" key="favicon--png-512x512" />
            <link rel="mask-icon" type="image/svg+xml" href="/mask-icon.svg" color="#402020" key="favicon--mask" />
            <link rel="apple-touch-icon" sizes="180x180" type="image/png" href="/img/blanktar-logo@180.png" key="favicon--apple" />

            <link rel="alternate" type="application/atom+xml" href="/blog/feed.xml" key="feed" />

            {/*
                XXX: avoid recursive elements because Head can't have nested children inside.
                seealso: https://github.com/macrat/blanktar/issues/485
            */}
            {JsonLD({ data: Website })}
        </Head>
    );
};


export default memo(CommonResources, () => true);
