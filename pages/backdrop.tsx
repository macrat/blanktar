const FirstView = () => (
    <div>
        <svg xmlns="http://www.w3.org/2000/svg">
            <circle cx="100%" cy="100%" r="43.5%" fill="none" stroke="#bbb" strokeWidth="1%" />
            <circle cx="100%" cy="100%" r="55.5%" fill="none" stroke="#bbb" strokeWidth="11%" />
            <circle cx="100%" cy="100%" r="84%" fill="none" stroke="#bbb" strokeWidth="2.3%" />
            <circle cx="100%" cy="100%" r="102%" fill="none" stroke="#bbb" strokeWidth="6%" />
            <circle cx="100%" cy="100%" r="128%" fill="none" stroke="#bbb" strokeWidth="1.5%" />
            <circle cx="100%" cy="100%" r="138%" fill="none" stroke="#bbb" strokeWidth="0.6%" />
        </svg>

        <h1>BlankTar</h1>

        <style jsx>{`
            div {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 60px;
                font-weight: black;
            }
            svg {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            h1 {
                mix-blend-mode: color-dodge;
                color: #bbb;
            }
            div::after {
                content: '';
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                background-color: rgba(0, 0, 0, .3);
            }
        `}</style>
    </div>
);


const Content = () => (
    <main>
        {[...new Array(10)].map((_, i) => (
            <article key={i}>
                <h1>this is a content</h1>

                <p>hello world!</p>

                <section>
                    <h2>section!</h2>

                    <p>hello</p>
                    <p>hello!</p>
                    <p>section!!</p>
                </section>
            </article>
        ))}

        <style jsx>{`
            main {
                margin: -1cm 0;
            }
            article {
                max-width: 297mm;
                margin: 1cm auto;
                padding: 1cm;
                box-sizing: border-box;
                background-color: rgba(255, 255, 255, .8);
                backdrop-filter: blur(3mm);
            }
        `}</style>
    </main>
);


const Index = () => (
    <>
        <FirstView />

        <div className="content-wrapper">
            <div className="content-area">
                <Content />
            </div>
        </div>

        <style jsx global>{`
            html, body {
                margin: 0;
                padding: 0;
                color: rgba(0, 0, 0, .8);
            }
        `}</style>

        <style jsx>{`
            .content-wrapper::before {
                content: '';
                display: block;
                min-height: 10cm;
                height: 90vh;
            }
            .content-area {
                min-height: 10vh;
                width: 100%;
                padding: 1cm 0;
                box-sizing: border-box;
                background: fixed url("data:image/svg+xml,${
                    encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="0" width="100%" height="100%" fill="#aaa" />

                            <circle cx="100%" cy="100%" r="43.5%" fill="none" stroke="#666" stroke-width="1%" />
                            <circle cx="100%" cy="100%" r="55.5%" fill="none" stroke="#666" stroke-width="11%" />
                            <circle cx="100%" cy="100%" r="84%" fill="none" stroke="#666" stroke-width="2.3%" />
                            <circle cx="100%" cy="100%" r="102%" fill="none" stroke="#666" stroke-width="6%" />
                            <circle cx="100%" cy="100%" r="128%" fill="none" stroke="#666" stroke-width="1.5%" />
                            <circle cx="100%" cy="100%" r="138%" fill="none" stroke="#666" stroke-width="0.6%" />
                        </svg>
                    `.replace(/\n */g, "",))
                }");
                position: relative;
            }
            .content-area::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                backdrop-filter: blur(2mm);
            }
        `}</style>
    </>
);


export default Index;
