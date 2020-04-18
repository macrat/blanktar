import React, {FC} from 'react';
import {NextPage} from 'next';
import Link from 'next/link';

import MetaData from '~/components/MetaData';


const Index: NextPage = () => (
    <div className="container">
        <MetaData description="MacRatの個人Webサイト「Blanktar」。ブログとか色々。" />

        <div className="content">
            <h1>
                <svg width="256" height="256" viewBox="-2 -1.5 20 20" aria-hidden="true">
                    <polyline points="1 1, 7 7, 0 14" />
                    <polyline points="0 4, 7 11, 1 17" />
                    <polyline strokeWidth="0.5" points="15 1, 9 7, 16 14" />
                    <polyline strokeWidth="0.5" points="16 4, 9 11, 15 17" />
                </svg>

                Blanktar
            </h1>

            <ul>
                <li className="about"><Link href="/about"><a>about</a></Link></li>
                <li className="blog"><Link href="/blog"><a>blog</a></Link></li>
                <li className="works"><Link href="/works"><a>works</a></Link></li>
                <li className="photos"><Link href="/photos"><a>photos</a></Link></li>
            </ul>
        </div>

        <style jsx>{`
            .container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            svg {
                width: auto;
                height: 2cm;
                fill: none;
                stroke: var(--colors-fg);
                stroke-dasharray: 18.38;
                transition: height .2s, width .2s;
                margin-right: 2mm;
            }
            h1 {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2cm;
                font-weight: 300;
                margin: 0;
                transition: font-size .2s;
            }
            ul {
                display: flex;
                justify-content: space-between;
                margin: 2mm 0 0;
                padding: 0;
            }
            li {
                display: block;
            }
            a {
                display: block;
                margin: -1mm -3mm;
                padding: 1mm 3mm;
                position: relative;
                font-size: 6mm;
                font-weight: 300;
                text-decoration: none;
                color: var(--colors-fg);
                transition: font-size .2s, color .2s;
            }
            a:focus, a:hover {
                color: var(--colors-bg);
            }
            a::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--colors-fg);
                z-index: -1;
                transform: scaleY(0);
                transition: transform .2s;
            }
            a:focus::before, a:hover::before {
                transform: scaleY(1);
            }

            @media screen and (max-width: 11cm) {
                svg {
                    height: 17mm;
                }
                h1 {
                    font-size: 17mm;
                }
                a {
                    font-size: 5mm;
                }
            }
            @media screen and (max-width: 9cm) {
                svg {
                    height: 15mm;
                }
                h1 {
                    font-size: 15mm;
                }
            }
        `}</style>
    </div>
);


export default Index;
