import { FC } from 'react';
import { useAmp } from 'next/amp';

import animation from './animation';


const Tombo: FC = ({ children }) => (
    <div>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className={`tombo top left ${animation.className}`} aria-hidden="true">
            <polyline points="15 0, 15 10, 5 10" fill="none" strokeWidth="0.2" className={animation.className} />
            <polyline points="10 5, 10 15, 0 15" fill="none" strokeWidth="0.2" className={animation.className} />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className={`tombo top center ${animation.className}`} aria-hidden="true">
            <line x1="0" x2="15" y1="10" y2="10" strokeWidth="0.2" className={`horizontal ${animation.className}`} />
            <line x1="7.5" x2="7.5" y1="5" y2="11" strokeWidth="0.2" className={`vertical ${animation.className}`} />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className={`tombo top right ${animation.className}`} aria-hidden="true">
            <polyline points="0 0, 0 10, 10 10" fill="none" strokeWidth="0.2" className={animation.className} />
            <polyline points="5 5, 5 15, 15 15" fill="none" strokeWidth="0.2" className={animation.className} />
        </svg>

        {children}

        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className={`tombo bottom left ${animation.className}`} aria-hidden="true">
            <polyline points="15 15, 15 5, 5 5" fill="none" strokeWidth="0.2" className={animation.className} />
            <polyline points="10 10, 10 0, 0 0" fill="none" strokeWidth="0.2" className={animation.className} />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className={`tombo bottom center ${animation.className}`} aria-hidden="true">
            <line x1="0" x2="15" y1="5" y2="5" strokeWidth="0.2" className={`horizontal ${animation.className}`} />
            <line x1="7.5" x2="7.5" y1="4" y2="10" strokeWidth="0.2" className={`vertical ${animation.className}`} />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className={`tombo bottom right ${animation.className}`} aria-hidden="true">
            <polyline points="0 15, 0 5, 10 5" fill="none" strokeWidth="0.2" className={animation.className} />
            <polyline points="5 10, 5 0, 15 0" fill="none" strokeWidth="0.2" className={animation.className} />
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

            .tombo {
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
                .tombo {
                    display: none;
                }
            }
        `}</style>

        {useAmp() ? null : animation.styles}
    </div>
);


export default Tombo;
