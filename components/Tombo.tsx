import {FC} from 'react';
import {useAmp} from 'next/amp';


const TomboAnimation = () => {
    const isAmp = useAmp();

    if (isAmp) return (<></>);

    return (
        <style jsx global>{`
            svg.tombo .vertical {
                stroke-dasharray: 6;
                animation: tombo--vertical-draw .6s ease both;
            }
            @keyframes tombo--vertical-draw {
                from { stroke-dashoffset: 6; }
                  to { stroke-dashoffset: 0; }
            }
            svg.tombo .horizontal {
                stroke-dasharray: 15;
                animation: tombo--horizontal-draw .6s ease both;
            }
            @keyframes tombo--horizontal-draw {
                from { stroke-dashoffset: 15; }
                  to { stroke-dashoffset: 0; }
            }
            svg.tombo polyline {
                stroke-dasharray: 20;
                animation: tombo--polyline-draw .6s ease both;
            }
            @keyframes tombo--polyline-draw {
                from { stroke-dashoffset: 20; }
                  to { stroke-dashoffset: 0; }
            }

            div.loading > main svg.tombo .vertical {
                animation: tombo--vertical-erase .6s ease both;
            }
            @keyframes tombo--vertical-erase {
                from { stroke-dashoffset: 12; }
                  to { stroke-dashoffset: 6; }
            }
            div.loading > main svg.tombo .horizontal {
                animation: hortombo--izontal-erase .6s ease both;
            }
            @keyframes tombo--horizontal-erase {
                from { stroke-dashoffset: 30; }
                  to { stroke-dashoffset: 15; }
            }
            div.loading > main svg.tombo polyline {
                animation: tombo--polyline-erase .6s ease both;
            }
            @keyframes tombo--polyline-erase {
                from { stroke-dashoffset: 40; }
                  to { stroke-dashoffset: 20; }
            }
        `}</style>
    );
};


export type Props = {
    color?: string,
};


const Tombo: FC<Props> = ({children, color='#322'}) => (
    <div>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo top left">
            <polyline points="15 0, 15 10, 5 10" fill="none" stroke={color} strokeWidth="0.2" />
            <polyline points="10 5, 10 15, 0 15" fill="none" stroke={color} strokeWidth="0.2" />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo top center">
            <line x1="0" x2="15" y1="10" y2="10" stroke={color} strokeWidth="0.2" className="horizontal" />
            <line x1="7.5" x2="7.5" y1="5" y2="11" stroke={color} strokeWidth="0.2" className="vertical" />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo top right">
            <polyline points="0 0, 0 10, 10 10" fill="none" stroke={color} strokeWidth="0.2" />
            <polyline points="5 5, 5 15, 15 15" fill="none" stroke={color} strokeWidth="0.2" />
        </svg>

        {children}

        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo bottom left">
            <polyline points="15 15, 15 5, 5 5" fill="none" stroke={color} strokeWidth="0.2" />
            <polyline points="10 10, 10 0, 0 0" fill="none" stroke={color} strokeWidth="0.2" />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo bottom center">
            <line x1="0" x2="15" y1="5" y2="5" stroke={color} strokeWidth="0.2" className="horizontal" />
            <line x1="7.5" x2="7.5" y1="4" y2="10" stroke={color} strokeWidth="0.2" className="vertical" />
        </svg>
        <svg width="16mm" height="16mm" viewBox="-0.5 -0.5 16 16" className="tombo bottom right">
            <polyline points="0 15, 0 5, 10 5" fill="none" stroke={color} strokeWidth="0.2" />
            <polyline points="5 10, 5 0, 15 0" fill="none" stroke={color} strokeWidth="0.2" />
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
        `}</style>

        <TomboAnimation />
    </div>
);


export default Tombo;
