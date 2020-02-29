import {FC} from 'react';


const Header: FC<{}> = () => (
    <header>
        <h1>Blanktar</h1>
        <nav>
            <ul>
                <li><a href="">blog</a></li>
                <li><a href="">works</a></li>
                <li><a href="">photos</a></li>
                <li><a href="">about</a></li>
            </ul>
        </nav>

        <style jsx>{`
            header {
                text-align: center;
            }
            header h1 {
                font-size: 8mm;
                font-weight: inherit;
                margin: 0;
            }
            header h1::after {
                content: '';
                display: block;
                height: 0.4mm;
                width: 5cm;
                position: relative;
                left: calc(50% - 2.5cm);
                background-color: black;
            }

            ul {
                margin: 0;
                padding: 0;
            }
            li {
                display: inline-block;
                margin: 2px 8px;
                position: relative;
                animation: menu-fg .2s ease both;
            }
            @keyframes menu-fg {
                     0% { color: transparent; }
                    50% { color: transparent; }
                50.001% { color: inherit; }
            }
            li::before {
                content: '';
                display: block;
                position: absolute;
                left: 0;
                width: 100%;
                top: 100%;
                height: 0;
                background-color: black;
                animation: menu-bg .3s ease;
                transition: top .2s ease, height .2s ease;
            }
            @keyframes menu-bg {
                0% { top: 0; height: 0; }
                50% { top: 0; height: 100%; }
                100% { top: 100%; height: 0; }
            }
            li:nth-child(2)::before { animation-delay: .1s; }
            li:nth-child(3)::before { animation-delay: .2s; }
            li:nth-child(4)::before { animation-delay: .3s; }

            a {
                position: relative;
                display: inline-block;
                padding: 2px 8px;
                z-index: 1;
                color: inherit;
                text-decoration: none;
                transition: color .2s ease;
            }
            li:hover a {
                color: white;
            }
            li:hover::before {
                top: 0;
                height: 100%;
            }
        `}</style>
    </header>
);


const TomboArticle: FC<{color?: string}> = ({children, color='black'}) => (
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
                margin: 30mm auto;
                max-width: 297mm;
                position: relative;
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

const Tombo = () => (
    <>
        <Header />

        <TomboArticle>
            <h1>this is a content</h1>

            <p>hello world!</p>

            <section>
                <h2>section!</h2>

                <p>hello</p>
                <p>hello!</p>
                <p>section!!</p>
            </section>
        </TomboArticle>
    </>
);


export default Tombo;
