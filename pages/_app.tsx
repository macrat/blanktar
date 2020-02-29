import {AppProps} from 'next/app';

import Header from '../components/Header';


const TomboApp = ({Component, pageProps}: AppProps) => (
    <main>
        <Header />

        <Component {...pageProps} />

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
        `}</style>
    </main>
);


export default TomboApp;
