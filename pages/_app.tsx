import {FC, useState, useEffect, memo} from 'react';
import {AppProps} from 'next/app';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useAmp} from 'next/amp';
import ReactGA from 'react-ga';
import env from 'penv.macro';

import useLoading from '~/lib/loading';

import Header from '~/components/Header';
import JsonLD, {Website} from '~/components/JsonLD';
import SearchBar from '~/components/SearchBar';
import Footer from '~/components/Footer';


ReactGA.initialize(
    process.env.GOOGLE_ANALYTICS!,
    env({
        development: {
            debug: true,
            gaOptions: {
                siteSpeedSampleRate: 100,
            },
        },
    }, {}),
);


const CommonResources = memo(function CommonResources() {
    const [fontCSS, setFontCSS] = useState<string>("");
    const isAmp = useAmp();
    const router = useRouter();

    useEffect(() => {
        ReactGA.pageview(router.pathname);
    }, [router.pathname]);

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
                rel="stylesheet"
                type="text/css"
                href={isAmp ? 'https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese' : fontCSS}
                crossOrigin={isAmp ? "anonymous" : undefined}
                key="style--font" />

            <meta name="theme-color" content="#402020" />
            <link rel="icon" sizes="any" type="image/svg+xml" href="/favicon.svg" key="favicon--svg" />
            <link rel="icon" sizes="512x512" type="image/png" href="/img/blanktar-logo.png" key="favicon--png-512x512" />
            <link rel="mask-icon" type="image/svg+xml" href="/mask-icon.svg" color="#402020" key="favicon--mask" />

            <link rel="alternate" type="application/atom+xml" href="/blog/feed.xml" key="feed" />

            <JsonLD data={Website} />
        </Head>
    );
} as FC<{}>, () => true);


const BlanktarApp = ({Component, pageProps}: AppProps) => {
    const loading = useLoading();

    useEffect(() => {
        if (loading && document?.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }, [loading]);

    return (
        <div className={loading ? "loading" : ""}>
            <CommonResources />

            {pageProps.__disableHeader ? null : <Header />}

            {pageProps.__disableSearchBar ? null : <SearchBar />}

            <main>
                <Component {...pageProps} />
            </main>

            <Footer />

            <style jsx global>{`
                html {
                    --colors-fg: #402020;
                    --colors-dark-fg: #c0b3b3;
                    --colors-bg: #fcf8f5;
                    --colors-block-bg: #f7f0ec;
                    --colors-img-trace: #d0c3c3;
                    --colors-link: #6941e1;
                    --colors-accent: #e2005a;

                    --colors-comment: #706c6c;
                    --colors-namespace: #786b6b;
                    --colors-string: #d70c64;
                    --colors-value: #007c60;
                    --colors-keyword: #3838aa;
                    --colors-function: #8d0f1b;
                }
                @media screen and (prefers-color-scheme: dark) {
                    html {
                        --colors-fg: #fcf8f5;
                        --colors-dark-fg: #9f9393;
                        --colors-bg: #4d4444;
                        --colors-block-bg: #554a4a;
                        --colors-img-trace: #2d1b1b;
                        --colors-link: #b1afef;
                        --colors-accent: #ff96b0;

                        --colors-comment: #cbc1c1;
                        --colors-namespace: #d3cfcd;
                        --colors-string: #ffa1ca;
                        --colors-value: #74cad3;
                        --colors-keyword: #b7b7ff;
                        --colors-function: #ecc2c6;
                    }
                }

                html {
                    background-color: var(--colors-bg);
                    color: var(--colors-fg);
                    font-family: 'Noto Sans JP', 'Hiragino Sans', Meiryo, sans-serif;
                    overflow: hidden auto;
                }
                @media print {
                    html {
                        background: none;
                        font-size: 10.5pt;
                    }
                }
                body {
                    margin: 0;
                    overflow: hidden;
                }
                a {
                    position: relative;
                    color: var(--colors-link);
                    text-decoration: underline dotted;
                    transition: color .2s ease;
                }
                a:hover, a:focus {
                    color: var(--colors-accent);
                }
                mark {
                    background-color: var(--colors-block-bg);
                    color: var(--colors-accent);
                }
            `}</style>

            <style jsx>{`
                div {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                }
                main {
                    flex: 1 1 0;
                }
                div::before {
                    content: '';
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 100%;
                    width: 100vw;
                    height: .3mm;
                    background-color: var(--colors-fg);
                    animation: done .5s ease both;
                }
                @keyframes done {
                    from { transform: translate(-100%, 0); }
                      to { transform: translate(0, 0); }
                }
                .loading::before  {
                    animation: loading 1s linear infinite;
                }
                @keyframes loading {
                    from { transform: translate(-200%, 0); }
                      to { transform: translate(0, 0); }
                }
            `}</style>
        </div>
    );
};


export default BlanktarApp;
