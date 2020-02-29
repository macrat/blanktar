import {AppProps} from 'next/app';

import Header from '../components/Header';
import MDXComponents from '../components/MDXComponents';


const TomboApp = ({Component, pageProps}: AppProps) => (
    <main>
        <Header />

        <MDXComponents>
            <Component {...pageProps} />
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
    </main>
);


export default TomboApp;
