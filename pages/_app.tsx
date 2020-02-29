import {useState, useEffect} from 'react';
import {AppProps} from 'next/app';
import Router from 'next/router';

import Header from '../components/Header';
import MDXComponents from '../components/MDXComponents';


const TomboApp = ({Component, pageProps}: AppProps) => {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const onStart = () => setLoading(true);
        const onComplete = () => setLoading(false);

        Router.events.on('routeChangeStart', onStart);
        Router.events.on('routeChangeComplete', onComplete);

        return () => {
            Router.events.off('routeChangeStart', onStart);
            Router.events.off('routeChangeComplete', onComplete);
        };
    }, []);

    return (
        <div className={loading ? "loading" : ""}>
            <Header />

            <MDXComponents>
                <main>
                    <Component {...pageProps} />
                </main>
            </MDXComponents>

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
                    height: .3mm;
                    background-color: #322;
                    animation: done .5s ease both;
                }
                @keyframes done {
                    from { left: 0; width: 100%; }
                      to { left: 100%; width: 0; }
                }
                div.loading::after  {
                    animation: loading 1s linear infinite;
                }
                @keyframes loading {
                      0% { left:    0; width: 0; }
                     50% { left:    0; width: 100%; }
                    100% { left: 100%; width: 0; }
                }
            `}</style>
        </div>
    );
};


export default TomboApp;
