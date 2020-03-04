import {useState, useEffect} from 'react';
import {AppProps} from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import {useAmp} from 'next/amp';
import fetch from 'isomorphic-unfetch';

import Header from '../components/Header';


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
                <link
                    rel="dns-prefetch preconnect"
                    href="https://fonts.gstatic.com"
                    key="preconnect--gstatic" />
                <link
                    rel="stylesheet"
                    type="text/css"
                    href={isAmp ? 'https://fonts.googleapis.com/css?family=Noto+Sans+JP:100,300,400&display=swap&subset=japanese' : fontCSS}
                    key="style--font" />
            </Head>

            <Header />

            <main>
                <Component {...pageProps} />
            </main>

            <style jsx global>{`
                html {
                    background-color: #eee;
                    color: #322;
                    font-family: 'Noto Sans JP', gothic, sans-serif;
                    overflow: hidden auto;
                }
                body {
                    margin: 0;
                }
                a {
                    position: relative;
                    color: #63f;
                    transition: color .2s ease;
                }
                a:hover, a:focus {
                    color: #f36;
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
                div::after {
                    content: '';
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 100%;
                    width: 100vw;
                    height: .3mm;
                    background-color: #322;
                    animation: done .5s ease both;
                }
                @keyframes done {
                    from { transform: translate(-100%, 0); }
                      to { transform: translate(0, 0); }
                }
                div.loading::after  {
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
