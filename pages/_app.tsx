import {useState, useEffect} from 'react';
import {AppProps} from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import {useAmp} from 'next/amp';
import fetch from 'isomorphic-unfetch';

import Header from '../components/Header';
import JsonLD, {Website} from '../components/JsonLD';
import Footer from '../components/Footer';


const TomboApp = ({Component, pageProps}: AppProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [fontCSS, setFontCSS] = useState<string>("");
    const isAmp = useAmp();

    useEffect(() => {
        fetch('/api/font')
            .then(resp => resp.text())
            .then(css => setFontCSS(`data:text/css,${encodeURIComponent(css)}`));

        const onStart = () => setLoading(true);
        const onComplete = () => {
            setLoading(false);
            if (document?.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
            }
        };

        Router.events.on('routeChangeStart', onStart);
        Router.events.on('routeChangeComplete', onComplete);

        return () => {
            Router.events.off('routeChangeStart', onStart);
            Router.events.off('routeChangeComplete', onComplete);
        };
    }, []);

    return (
        <div className={loading ? "loading" : ""}>
            <Head>
                <meta charSet="utf-8" />

                <link
                    rel="dns-prefetch preconnect"
                    href="https://fonts.gstatic.com"
                    key="preconnect--gstatic" />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href={isAmp ? 'https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese' : fontCSS}
                    key="style--font" />

                <meta name="theme-color" content="#402020" />
                <link rel="icon" sizes="any" type="image/svg+xml" href="/favicon.svg" key="favicon--svg" />
                <link rel="icon" sizes="512x512" type="image/png" href="/img/blanktar-logo.png" key="favicon--png-512x512" />
                <link rel="mask-icon" type="image/svg+xml" href="/mask-icon.svg" color="#402020" key="favicon--mask" />

                <JsonLD data={Website} />
            </Head>

            {pageProps.__disableHeader ? null : <Header />}

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
                    --colors-link: #6941e1;
                    --colors-accent: #ff245b;

                    --colors-comment: #a89494;
                    --colors-namespace: #786b6b;
                    --colors-string: #e3116c;
                    --colors-operator: #393a34;
                    --colors-value: #36acaa;
                    --colors-keyword: #3838aa;
                    --colors-function: #8d0f1b;
                    --colors-variable: #6f42c1;
                }
                @media (prefers-color-scheme: dark) {
                    html {
                        --colors-fg: #fcf8f5;
                        --colors-dark-fg: #9f9393;
                        --colors-bg: #4d4444;
                        --colors-block-bg: #5a5050;
                        --colors-link: #a09dff;
                        --colors-accent: #ff245b;

                        --colors-comment: #b8a5a5;
                        --colors-namespace: #d3cfcd;
                        --colors-string: #ff348c;
                        --colors-operator: #d8d9d3;
                        --colors-value: #36acaa;
                        --colors-keyword: #a4a4ff;
                        --colors-function: #ecc2c6;
                        --colors-variable: #6f42c1;
                    }
                }

                html {
                    background-color: var(--colors-bg);
                    color: var(--colors-fg);
                    font-family: 'Noto Sans JP', gothic, sans-serif;
                    overflow: hidden auto;
                }
                body {
                    margin: 0;
                }
                a {
                    position: relative;
                    color: var(--colors-link);
                    transition: color .2s ease;
                }
                a:hover, a:focus {
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
                div.loading::before  {
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


export default TomboApp;
