import React, { FC } from 'react';
import { AppProps } from 'next/app';

import { ContextProvider, useContext } from '~/lib/context';
import '~/assets/common-style.css';

import Analytics, { reportSpeed } from '~/components/Analytics';
import CommonResources from '~/components/CommonResources';
import Footer from '~/components/Footer';


const BlanktarContentWrapper: FC = ({ children }) => {
    const { loading } = useContext();

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


const BlanktarApp = ({ Component, pageProps }: AppProps) => {
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

            <style jsx>{`
                flex: 1 1 0;
            `}</style>
        </ContextProvider>
    );
};


export function reportWebVitals({ name, value }: {name: string; value: number}) {
    reportSpeed(name, name === 'CLS' ? value * 1000 : value);
}


export default BlanktarApp;
