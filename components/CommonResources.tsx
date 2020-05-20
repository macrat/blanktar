import React, {FC, useState, useEffect, memo} from 'react';
import {useAmp} from 'next/amp';
import Head from 'next/head';

import JsonLD, {Website} from '~/components/JsonLD';


const CommonResources: FC = () => {
    const [fontCSS, setFontCSS] = useState<string>("");
    const isAmp = useAmp();

    useEffect(() => {
        fetch('/font.css')
            .then(resp => resp.text())
            .then(css => setFontCSS(URL.createObjectURL(new Blob([css], {type: 'text/css'}))));
    }, []);

    return (
        <Head>
            <meta charSet="utf-8" />

            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
                key="preconnect--gstatic" />
            {isAmp ? '' : (
                <link
                    rel="prefetch"
                    as="stylesheet"
                    type="text/css"
                    href="/font.css"
                    key="prefetch--font" />
            )}
            <link
                rel="preconnect"
                href="https://www.google-analytics.com"
                crossOrigin="anonymous"
                key="preconnect--google-analytics" />
            <link
                rel="stylesheet"
                type="text/css"
                href={isAmp ? 'https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese' : fontCSS}
                crossOrigin={isAmp ? "anonymous" : undefined}
                key="style--font" />

            <meta name="theme-color" content="#402020" />
            <link rel="icon" sizes="any" type="image/svg+xml" href="/favicon.svg" key="favicon--svg" />
            <link rel="icon" sizes="512x512" type="image/png" href="/img/blanktar-logo@512.png" key="favicon--png-512x512" />
            <link rel="mask-icon" type="image/svg+xml" href="/mask-icon.svg" color="#402020" key="favicon--mask" />

            <link rel="alternate" type="application/atom+xml" href="/blog/feed.xml" key="feed" />

            <JsonLD data={Website} />
        </Head>
    );
};


export default memo(CommonResources, () => true);
