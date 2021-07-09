import React, { FC } from 'react';


const Tombo: FC = ({ children }) => (
    <div>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="top left" aria-hidden="true">
            <g transform="translate(15,  0)"><line y2="10"                         className="vertical-early"  /></g>
            <g transform="translate( 5, 10)"><line x2="10" transform-origin="10 0" className="horizontal-late" /></g>

            <g transform="translate(10,  5)"><line y2="10"                         className="vertical-early"  /></g>
            <g transform="translate( 0, 15)"><line x2="10" transform-origin="10 0" className="horizontal-late" /></g>
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="top center" aria-hidden="true">
            <g transform="translate(  0, 10)"><line x2="15" className="horizontal-full" /></g>
            <g transform="translate(7.5,  5)"><line y2=" 6" className="vertical-full"   /></g>
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="top right" aria-hidden="true">
            <g                             ><line y2="10" className="vertical-early"  /></g>
            <g transform="translate(0, 10)"><line x2="10" className="horizontal-late" /></g>

            <g transform="translate(5,  5)"><line y2="10" className="vertical-early"  /></g>
            <g transform="translate(5, 15)"><line x2="10" className="horizontal-late" /></g>
        </svg>

        {children}

        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="bottom left" aria-hidden="true">
            <g transform="translate(15, 5)"><line y2="10" transform-origin=" 0 10" className="vertical-early"  /></g>
            <g transform="translate( 5, 5)"><line x2="10" transform-origin="10  0" className="horizontal-late" /></g>

            <g transform="translate(10, 0)"><line y2="10" transform-origin=" 0 10" className="vertical-early"  /></g>
            <g                             ><line x2="10" transform-origin="10  0" className="horizontal-late" /></g>
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="bottom center" aria-hidden="true">
            <g transform="translate(  0, 5)"><line x2="15"                        className="horizontal-full" /></g>
            <g transform="translate(7.5, 4)"><line y2=" 6" transform-origin="0 6" className="vertical-full"   /></g>
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="bottom right" aria-hidden="true">
            <g transform="translate(0, 5)"><line y2="10" transform-origin="0 10" className="vertical-early"  /></g>
            <g transform="translate(0, 5)"><line x2="10"                         className="horizontal-late" /></g>

            <g transform="translate(5, 0)"><line y2="10" transform-origin="0 10" className="vertical-early"  /></g>
            <g transform="translate(5, 0)"><line x2="10"                         className="horizontal-late" /></g>
        </svg>

        <style jsx>{`
            div {
                margin: 2cm auto;
                width: 297mm;
                position: relative;
            }
            @media (max-width: 311mm) {
                div {
                    width: auto;
                    margin: 2cm 7mm;
                }
            }

            svg {
                position: absolute;
                stroke: var(--colors-fg);
            }
            .top {
                top: -15mm;
            }
            .center {
                left: calc(50% - 15mm / 2);
            }
            .left {
                left: -15mm;
            }
            .right {
                right: -15mm;
            }
            .bottom {
                bottom: -15mm;
            }

            @media print {
                div {
                    width: 100%;
                    margin: 0;
                }
                svg {
                    display: none;
                }
            }

            line {
                stroke-width: 0.2;
            }

            @keyframes vertical-draw {
                from { transform: scaleY(0); }
                  to { transform: scaleY(1); }
            }
            @keyframes vertical-erase {
                from { transform: scaleY(1); }
                  to { transform: scaleY(0); }
            }
            @keyframes horizontal-draw {
                from { transform: scaleX(0); }
                  to { transform: scaleX(1); }
            }
            @keyframes horizontal-erase {
                from { transform: scaleX(1); }
                  to { transform: scaleX(0); }
            }

            .vertical-full   { animation: vertical-draw   .6s ease both; }
            .horizontal-full { animation: horizontal-draw .6s ease both; }

            .vertical-early   { animation: vertical-draw   .3s ease-in  both;     }
            .vertical-late    { animation: vertical-draw   .3s ease-out both .3s; }
            .horizontal-early { animation: horizontal-draw .3s ease-in  both;     }
            .horizontal-late  { animation: horizontal-draw .3s ease-out both .3s; }

            :global(main.loading) .vertical-full   { animation: vertical-erase   .6s ease both; }
            :global(main.loading) .horizontal-full { animation: horizontal-erase .6s ease both; }

            :global(main.loading) .vertical-early   { animation: vertical-erase   .3s ease-in  both .3s; }
            :global(main.loading) .vertical-late    { animation: vertical-erase   .3s ease-out both;     }
            :global(main.loading) .horizontal-early { animation: horizontal-erase .3s ease-in  both .3s; }
            :global(main.loading) .horizontal-late  { animation: horizontal-erase .3s ease-out both;     }

            @media (prefers-reduced-motion: reduce) {
                svg line {
                    animation: none;
                }
            }
        `}</style>
    </div>
);


export default Tombo;
