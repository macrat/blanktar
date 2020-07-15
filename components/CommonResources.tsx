import React, { FC, useState, useEffect, memo } from 'react';
import { useAmp } from 'next/amp';
import Head from 'next/head';

import { FONT_STYLE_SHEET } from '~/lib/font';

import JsonLD, { Website } from '~/components/JsonLD';


const CommonResources: FC = () => {
    const [fontCSS, setFontCSS] = useState<string>("");
    const isAmp = useAmp();

    useEffect(() => {
        fetch(FONT_STYLE_SHEET)
            .then(resp => resp.text())
            .then(css => setFontCSS(URL.createObjectURL(new Blob([css], { type: 'text/css' }))));
    }, []);

    return (
        <Head>
            <meta charSet="utf-8" />

            {/* フォント用のCSS */}
            {isAmp ? '' : (
                <link
                    rel="prefetch"
                    as="stylesheet"
                    type="text/css"
                    href={FONT_STYLE_SHEET}
                    key="prefetch--font" />
            )}
            <link
                rel="stylesheet"
                type="text/css"
                href={isAmp ? 'https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese' : fontCSS}
                crossOrigin={isAmp ? "anonymous" : undefined}
                key="style--font" />

            {/* アナリティクスも一応事前に接続しておく */}
            <link
                rel="preconnect"
                href="https://www.google-analytics.com"
                crossOrigin="anonymous"
                key="preconnect--google-analytics" />

            <meta name="theme-color" content="#402020" />
            <link rel="manifest" href="/manifest.json" key="webmanifest" />
            <link rel="icon" sizes="any" type="image/svg+xml" href="/favicon.svg" key="favicon--svg" />
            <link rel="icon" sizes="512x512" type="image/png" href="/img/blanktar-logo@512.png" key="favicon--png-512x512" />
            <link rel="mask-icon" type="image/svg+xml" href="/mask-icon.svg" color="#402020" key="favicon--mask" />
            <link rel="apple-touch-icon" sizes="180x180" type="image/png" href="/img/blanktar-logo@180.png" key="favicon--apple" />

            <link rel="alternate" type="application/atom+xml" href="/blog/feed.xml" key="feed" />

            <JsonLD data={Website} />
        </Head>
    );
};


export default memo(CommonResources, () => true);
