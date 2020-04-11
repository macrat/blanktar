import React, {FC} from 'react';


const AnchorLink: FC<{before: string}> = ({before, children}) => (
    <a href={`#${children}`} id={`${children}`}>
        {children}

        <svg height="24" width="24" viewBox="0 0 24 24">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1z"/>
            <path d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
            <rect className="outer" width="24" height="24"/>

            <path d="M8 13h8v-2H8v2z"/>
            <rect className="inner" width="24" height="24"/>
        </svg>

        <style jsx>{`
            a {
                color: inherit;
                text-decoration: none;
            }
            :hover, :focus {
                color: inherit;
            }
            a::before {
                content: '${before} ';
                opacity: .2;
            }
            svg {
                display: inline-block;
                height: .7em;
                width: .7em;
                margin-left: .1em;
            }
            path {
                fill: var(--colors-dark-fg);
            }
            rect {
                fill: var(--colors-bg);
            }
            .inner {
                animation: inner-out .2s ease .05s both;
            }
            :hover .inner, :focus .inner {
                animation: inner-in .2s ease both;
            }
            @keyframes inner-in {
                from { transform: translate(0, 0) scaleX(1); }
                  to { transform: translate(100%, 0) scaleX(0); }
            }
            @keyframes inner-out {
                from { transform: scaleX(0); }
                  to { transform: scaleX(1); }
            }
            .outer {
                animation: outer-out .1s ease both;
            }
            :hover .outer, :focus .outer {
                animation: outer-in .1s ease .1s both;
            }
            @keyframes outer-in {
                from { transform: translate(0, 0) scaleX(1); }
                  to { transform: translate(50%, 0) scaleX(0); }
            }
            @keyframes outer-out {
                from { transform: translate(50%, 0) scaleX(0); }
                  to { transform: translate(0, 0) scaleX(1); }
            }

            @media print {
                a::before {
                    opacity: .5;
                }
                svg {
                    display: none;
                }
            }
        `}</style>
    </a>
);


export type Props = {};


export const H1: FC<Props> = ({children}) => (
    <h2>
        <AnchorLink before="#">{children}</AnchorLink>

        <style jsx>{`
            font-weight: 400;
            font-size: 28pt;
            margin: 12mm 0 0;

            @media print {
                margin: 6mm 0 0;
                font-weight: 300;
            }
        `}</style>
    </h2>
);


export const H2: FC<Props> = ({children}) => (
    <h3>
        <AnchorLink before="##">{children}</AnchorLink>

        <style jsx>{`
            font-weight: 400;
            font-size: 20pt;
            margin: 10mm 0 0;

            @media print {
                margin: 5mm 0 0;
                font-weight: 300;
            }
        `}</style>
    </h3>
);


export const H3: FC<Props> = ({children}) => (
    <h4>
        <AnchorLink before="###">{children}</AnchorLink>

        <style jsx>{`
            font-weight: 400;
            font-size: 18pt;
            margin: 6mm 0 0;

            @media print {
                margin: 4mm 0 0;
                font-weight: 300;
            }
        `}</style>
    </h4>
);
