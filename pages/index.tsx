import {NextPage} from 'next';
import Link from 'next/link';

import MetaData from '../components/MetaData';


export type Props = {
    __disableHeader: boolean,
    __disableSearchBar: boolean,
};


const Index: NextPage<Props> = () => (
    <div>
        <MetaData />

        <svg width="256" height="256" viewBox="-2 -1.5 20 20">
            <polyline fill="none" points="1 1, 7 7, 0 14" />
            <polyline fill="none" points="0 4, 7 11, 1 17" />
            <polyline fill="none" strokeWidth="0.5" points="15 1, 9 7, 16 14" />
            <polyline fill="none" strokeWidth="0.5" points="16 4, 9 11, 15 17" />
        </svg>

        <ul>
            <li><Link href="/about"><a>about</a></Link></li>
            <li><Link href="/blog"><a>blog</a></Link></li>
            <li><Link href="/works"><a>works</a></Link></li>
            <li><Link href="/photos"><a>photos</a></Link></li>
        </ul>

        <style jsx>{`
            div {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                overflow: hidden;
            }
            svg {
                width: 7cm;
                height: auto;
            }
            ul {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                margin: 0;
                padding: 0;
            }
            li {
                display: block;
                margin: 0 3mm;
                padding: 0;
            }
            a {
                padding: 0 3mm;
            }

            polyline {
                stroke: var(--colors-fg);
                stroke-dasharray: 18.38;
            }
            polyline:nth-of-type(1) { animation: line-show 1s ease both; }
            polyline:nth-of-type(2) { animation: line-show 1s ease .5s both; }
            polyline:nth-of-type(3) { animation: line-show 1s ease 1s both; }
            polyline:nth-of-type(4) { animation: line-show 1s ease 1s both; }
            @keyframes line-show {
                from { stroke-dashoffset: 18.38; }
                  to { stroke-dashoffset: 0; }
            }

            .left-shutter {
                animation: left-shutter 1s ease 2s both;
            }
            @keyframes left-shutter {
                from { transform: translate(0, 0); }
                  to { transform: translate(-50%, 0); }
            }
            .right-shutter {
                animation: right-shutter 1s ease 2s both;
            }
            @keyframes right-shutter {
                from { transform: translate(0, 0); }
                  to { transform: translate(50%, 0); }
            }

            li:nth-of-type(1) { animation: link-show 1.4s ease 1.5s both; }
            li:nth-of-type(2) { animation: link-show 1.4s ease 1.6s both; }
            li:nth-of-type(3) { animation: link-show 1.4s ease 1.7s both; }
            li:nth-of-type(4) { animation: link-show 1.4s ease 1.8s both; }
            @keyframes link-show {
                from { opacity: 0; }
                  to { opacity: 1; }
            }
        `}</style>
    </div>
);


export default Index;


export const unstable_getStaticProps = () => ({
    props: {
        __disableHeader: true,
        __disableSearchBar: true,
    },
});
