import React from 'react';
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
                <li><Link href="/about"><a>about</a></Link></li>
                <li><Link href="/blog"><a>blog</a></Link></li>
                <li><Link href="/works"><a>works</a></Link></li>
                <li><Link href="/photos"><a>photos</a></Link></li>
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
                overflow: hidden;
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
                position: relative;
            }
            h1::after {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: var(--colors-bg);
                animation: shutter-right .8s both;
            }
            @keyframes shutter-right {
                from { transform: translate(0, 0); }
                  to { transform: translate(100%, 0); }
            }
            ul {
                display: flex;
                justify-content: space-between;
                margin: 2mm 0 0;
                padding: 0;
                position: relative;
            }
            ul::after {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                background-color: var(--colors-bg);
                animation: shutter-left .5s both .8s;
            }
            @keyframes shutter-left {
                from { transform: translate(0, 0); }
                  to { transform: translate(0, 115%); }
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
                outline: none;
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
