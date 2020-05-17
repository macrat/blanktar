import React, {FC} from 'react';
import {AppProps} from 'next/app';

import {ContextProvider, useContext} from '~/lib/context';

import Analytics, {reportSpeed} from '~/components/Analytics';
import CommonResources from '~/components/CommonResources';
import Footer from '~/components/Footer';


const BlanktarContentWrapper: FC = ({children}) => {
    const {loading} = useContext();

    return (
        <main className={loading ? "loading" : ""}>
            {children}

            <style jsx>{`
                min-height: 100vh;
                display: flex;
                flex-direction: column;

                ::before {
                    content: '';
                    display: block;
                    position: fixed;
                    top: 0;
                    left: 100%;
                    width: 100vw;
                    height: 1px;
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
        </main>
    );
};


const BlanktarApp = ({Component, pageProps}: AppProps) => {
    return (
        <ContextProvider>
            <Analytics />

            <CommonResources />

            <BlanktarContentWrapper>
                <div>
                    <Component {...pageProps} />
                </div>

                <Footer />
            </BlanktarContentWrapper>

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
                    flex: 1 1 0;
                }
            `}</style>
        </ContextProvider>
    );
};


export function reportWebVitals({name, value}: {name: string; value: number}) {
    reportSpeed(name, name === 'CLS' ? value * 1000 : value);
}


export default BlanktarApp;
