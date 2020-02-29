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
                margin: 1cm 0 1cm;
            }
            header h1 {
                font-size: 8mm;
                font-weight: 300;
                margin: 0;
            }
            header h1::after {
                content: '';
                display: block;
                height: 0.2mm;
                width: 5cm;
                position: relative;
                left: calc(50% - 2.5cm);
                background-color: #322;
            }

            ul {
                margin: 0;
                padding: 0;
            }
            li {
                display: inline-block;
                margin: 2px 8px;
                position: relative;
                animation: menu-fg .3s ease both;
            }
            li:nth-child(2) { animation-delay: .1s; }
            li:nth-child(3) { animation-delay: .2s; }
            li:nth-child(4) { animation-delay: .3s; }
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
                background-color: #322;
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
            li:hover a, li:focus-within a {
                color: white;
            }
            li:hover::before, li:focus-within::before {
                top: 0;
                height: 100%;
            }
            a:focus {
                outline: none;
            }
        `}</style>
    </header>
);


const SearchBox = () => (
    <form>
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="#332" /></svg>

        <input type="search" />

        <style jsx>{`
            form {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: 297mm;
                max-width: 100%;
                margin: 0 auto;
            }
            svg {
                height: 100%;
                width: auto;
            }
            input {
                background-color: transparent;
                border: none;
                border-bottom: 1px solid #322;
                padding: 2px 4px;
                width: 7cm;
            }
            input:focus {
                outline: none;
            }

            @media (max-width: 15cm) {
                form {
                    justify-content: center;
                    padding: 0 1cm;
                    width: 100%;
                    box-sizing: border-box;
                }
                input {
                    flex: 1 1 0;
                }
            }
        `}</style>
    </form>
);


const TomboArticle: FC<{color?: string}> = ({children, color='#322'}) => (
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
                max-width: 297mm;
                position: relative;
            }
            article {
                padding: 5mm;
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


const TagList: FC<{tags: string[]}> = ({tags}) => (
    <ul>
        {tags.map(x => (
            <li key={x}><a href="">test article</a></li>
        ))}

        <style jsx>{`
            ul {
                margin: 0;
                padding: 0;
            }
            li {
                display: inline-block;
                border: 1px solid #322;
                border-radius: 4px;
                margin: 2px 4px;
                position: relative;
            }
            li a {
                position: relative;
                color: #eee;
                text-decoration: none;
                display: inline-block;
                padding: 2px 4px;
                transition: color .1s ease;
            }
            a:focus {
                outline: none;
            }
            li:hover a, li:focus-within a {
                color: #322;
            }
            li::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: #322;
                transition: height .1s ease;
            }
            li:hover::before, li:focus-within::before {
                height: 0;
            }
        `}</style>
    </ul>
);


const date2str = (t: Date) => (
    `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日 ${t.getHours()}:${t.getMinutes()}`
);


const ArticleMeta: FC<{pubtime: Date, title: string, tags: string[]}> = ({pubtime, title, tags}) => (
    <header>
        <time dateTime={pubtime.toISOString()}>{date2str(pubtime)}</time>
        <h1>{title}</h1>
        <TagList tags={tags} />

        <style jsx>{`
            header {
                margin-bottom: 2em;
            }
            h1 {
                font-size: 48pt;
                font-weight: 100;
                margin: -1.2rem 0 -.5rem;
                padding: 0;
            }
            time {
                display: inline-block;
                margin-left: 1em;
                font-size: 120%;
                font-weight: 200;
            }
        `}</style>
    </header>
);


const Tombo = () => (
    <>
        <Header />

        <SearchBox />

        <TomboArticle>
            <ArticleMeta
                pubtime={new Date()}
                title="this is a content"
                tags={['test article', 'test', 'design', 'design test']} />

            <p>hello world!</p>

            <section>
                <h2>section!</h2>

                <p>hello</p>
                <p>hello!</p>
                <p>section!!</p>
            </section>
        </TomboArticle>

        <style jsx global>{`
            html {
                background-color: #eee;
                color: #322;
                font-family: 'Noto Sans JP', gothic, sans-serif;
                overflow: hidden auto;
            }
        `}</style>
    </>
);


export default Tombo;
