const tombo = 'data:image/svg+xml,' + encodeURIComponent(`
    <?xml version="1.0" encoding="utf-8" ?>
    <svg xmlns="http://www.w3.org/2000/svg" width="329mm" height="16mm" viewBox="0 0 329 16">
        <defs>
            <style type="text/css"><![CDATA[
                #horizontal {
                    stroke-dasharray: 15;
                    animation: horizontal-draw .4s ease;
                }
                @keyframes horizontal-draw {
                    from { stroke-dashoffset: 15; }
                      to { stroke-dashoffset: 0; }
                }
                #vertical {
                    stroke-dasharray: 6;
                    animation: vertical-draw .4s ease;
                }
                @keyframes vertical-draw {
                    from { stroke-dashoffset: 6; }
                      to { stroke-dashoffset: 0; }
                }
                polyline {
                    stroke-dasharray: 20;
                    animation: polyline-draw .4s ease;
                }
                @keyframes polyline-draw {
                    from { stroke-dashoffset: 20; }
                      to { stroke-dashoffset: 0; }
                }
            ]]></style>
        </defs>

        <polyline points="15 0, 15 10, 5 10" fill="none" stroke="#999" stroke-width="0.4" />
        <polyline points="10 5, 10 15, 0 15" fill="none" stroke="#999" stroke-width="0.4" />

        <line x1="157" x2="172" y1="10" y2="10" stroke="#999" stroke-width="0.4" id="horizontal"/>
        <line x1="164.5" x2="164.5" y1="5" y2="11" stroke="#999" stroke-width="0.4" id="vertical" />

        <polyline points="314 0, 314 10, 324 10" fill="none" stroke="#999" stroke-width="0.4" />
        <polyline points="319 5, 319 15, 329 15" fill="none" stroke="#999" stroke-width="0.4" />
    </svg>
`.replace(/\n */, ''));


const tomboCenter = 'data:image/svg+xml,' + encodeURIComponent(`
    <?xml version="1.0" encoding="utf-8" ?>
    <svg xmlns="http://www.w3.org/2000/svg" width="15mm" height="15mm" viewBox="0 0 15 15">
        <defs>
            <style type="text/css"><![CDATA[
                #vertical {
                    stroke-dasharray: 11;
                    animation: vertical-draw 1s ease;
                }
                @keyframes vertical-draw {
                    0% { stroke-dashoffset: 11; }
                    100% { stroke-dashoffset: 0; }
                }
                #horizontal {
                    stroke-dasharray: 15;
                    animation: horizontal-draw 1s ease;
                }
                @keyframes horizontal-draw {
                    0% { stroke-dashoffset: 15; }
                    100% { stroke-dashoffset: 0; }
                }
            ]]></style>
        </defs>

        <line x1="0" x2="15" y1="10" y2="10" stroke="#999" stroke-width="0.4" id="horizontal" />
        <line x1="7.5" x2="7.5" y1="5" y2="11" stroke="#999" stroke-width="0.4" id="vertical" />
    </svg>
`.replace(/\n */, ''));


const Tombo = () => (
    <>
        <header>
            Blanktar
        </header>

        <article>
                <h1>this is a content</h1>

                <p>hello world!</p>

                <section>
                    <h2>section!</h2>

                    <p>hello</p>
                    <p>hello!</p>
                    <p>section!!</p>
                </section>
        </article>

        <style jsx>{`
            header {
                font-size: 8mm;
                text-align: center;
            }
            header::after {
                content: '';
                display: block;
                height: 0.4mm;
                position: relative;
                left: calc(50% - 2.5cm);
                background-color: black;
                animation: header-draw .4s ease both;
            }
            @keyframes header-draw {
                from { width: 0; }
                  to { width: 5cm; }
            }

            article {
                margin: 30mm auto;
                max-width: 297mm;
                position: relative;
            }

            article::before, article::after {
                content: '';
                display: block;
                height: 15mm;
                width: 15mm;
                margin: 0 auto;
                position: absolute;
                left: calc(50vw - 7.5mm);
                background: url(${tomboCenter});
            }
            article::before {
                top: -15mm;
            }
            article::after {
                bottom: -15mm;
                transform: scale(1, -1);
            }

            @media (min-width: 300mm) {
                article::before, article::after {
                    width: 329mm;
                    height: 16mm;
                    left: -16mm;
                    background: url(${tombo});
            }
        `}</style>
    </>
);


export default Tombo;
