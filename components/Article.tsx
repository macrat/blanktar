import {FC} from 'react';


export type Props = {
    color?: string,
};


const Article: FC<Props> = ({children, color='#322'}) => (
    <div>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo top left">
            <polyline points="15 0, 15 10, 5 10" fill="none" stroke={color} stroke-width="0.2" />
            <polyline points="10 5, 10 15, 0 15" fill="none" stroke={color} stroke-width="0.2" />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo top center">
            <line x1="0" x2="15" y1="10" y2="10" stroke={color} stroke-width="0.2" className="horizontal" />
            <line x1="7.5" x2="7.5" y1="5" y2="11" stroke={color} stroke-width="0.2" className="vertical" />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo top right">
            <polyline points="0 0, 0 10, 10 10" fill="none" stroke={color} stroke-width="0.2" />
            <polyline points="5 5, 5 15, 15 15" fill="none" stroke={color} stroke-width="0.2" />
        </svg>

        <article>{children}</article>

        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo bottom left">
            <polyline points="15 15, 15 5, 5 5" fill="none" stroke={color} stroke-width="0.2" />
            <polyline points="10 10, 10 0, 0 0" fill="none" stroke={color} stroke-width="0.2" />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo bottom center">
            <line x1="0" x2="15" y1="5" y2="5" stroke={color} stroke-width="0.2" className="horizontal" />
            <line x1="7.5" x2="7.5" y1="4" y2="10" stroke={color} stroke-width="0.2" className="vertical" />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo bottom right">
            <polyline points="0 15, 0 5, 10 5" fill="none" stroke={color} stroke-width="0.2" />
            <polyline points="5 10, 5 0, 15 0" fill="none" stroke={color} stroke-width="0.2" />
        </svg>

        <style jsx>{`
            div {
                margin: 2cm auto;
                width: 297mm;
                position: relative;
            }
            article {
                padding: 5mm;
            }
            @media (max-width: 311mm) {
                div {
                    width: auto;
                    margin: 2cm 7mm;
                }
            }

            .tombo {
                position: absolute;
            }
            .tombo.top {
                top: -15mm;
            }
            .tombo.center {
                left: calc(50% - 15mm / 2);
            }
            .tombo.left {
                left: -15mm;
            }
            .tombo.right {
                right: -15mm;
            }
            .tombo.bottom {
                bottom: -15mm;
            }

            .vertical {
                stroke-dasharray: 6;
                animation: vertical-draw .6s ease both;
            }
            @keyframes vertical-draw {
                from { stroke-dashoffset: 6; }
                  to { stroke-dashoffset: 0; }
            }
            .horizontal {
                stroke-dasharray: 15;
                animation: horizontal-draw .6s ease both;
            }
            @keyframes horizontal-draw {
                from { stroke-dashoffset: 15; }
                  to { stroke-dashoffset: 0; }
            }
            polyline {
                stroke-dasharray: 20;
                animation: polyline-draw .6s ease both;
            }
            @keyframes polyline-draw {
                from { stroke-dashoffset: 20; }
                  to { stroke-dashoffset: 0; }
            }
        `}</style>
    </div>
);


export default Article;
