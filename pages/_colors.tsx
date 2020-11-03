import { NextPage } from 'next';
import { FC } from 'react';


const TitleText: FC = () => (
    <h1>
        Blanktar

        <style jsx>{`
            font-weight: 300;
        `}</style>
    </h1>
);


const ColorBlock: FC<{ background: string }> = ({ background }) => (
    <div>
        <span style={{ color: 'var(--colors-fg)' }}>hello world</span>
        <span style={{ color: 'var(--colors-bg)' }}>hello world</span>

        <style jsx>{`
            div {
                display: inline-block;
                background-color: var(--colors-${background});
                width: 128px;
                height: 128px;
                padding: 8px;
                box-sizing: border-box;
            }
            span {
                display: block;
            }
        `}</style>
    </div>
);


const ColorBlockSet: FC = () => (
    <div>
        {['bg', 'block-bg', 'dark-fg', 'fg'].map(bg => (
            <ColorBlock key={bg} background={bg} />
        ))}
    </div>
);


const ArticleBlock: FC = () => (
    <div>
        Lorem <a>ipsum</a> dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna <strong>aliqua</strong>. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

        <style jsx>{`
            div {
                width: 512px;
                margin: 8px 0;
            }
            strong {
                color: var(--colors-accent);
                font-weight: inherit;
            }
        `}</style>
    </div>
);


const CodeSpan: FC<{ color: string; children: string }> = ({ color, children }) => (
    <span style={{ color: `var(--colors-${color})` }}>{children}</span>
);


const CodeBlock: FC = () => (
    <div>
        <pre><CodeSpan color="comment">{`// source code highlighting`}</CodeSpan></pre>
        <pre><CodeSpan color="keyword">{`function`}</CodeSpan>{` `}<CodeSpan color="function">{`blanktar`}</CodeSpan>{`() {`}</pre>
        <pre>{`    `}<CodeSpan color="namespace">{`hello`}</CodeSpan>{`.`}<CodeSpan color="function">{`world`}</CodeSpan>{`(`}<CodeSpan color="string">{`'blanktar'`}</CodeSpan>{`, `}<CodeSpan color="value">{`42`}</CodeSpan>{`);`}</pre>
        <pre>{`}`}</pre>

        <style jsx>{`
            div {
                width: 512px;
                background-color: var(--colors-block-bg);
                padding: 8px 12px;
                box-sizing: border-box;
            }
            pre {
                margin: 0;
            }
        `}</style>
    </div>
);


const ThemeBlock: FC<{ theme: 'dark' | 'light' }> = ({ theme }) => (
    <div className={theme}>
        <TitleText />

        <ColorBlockSet />

        <ArticleBlock />

        <CodeBlock />

        <style jsx>{`
            flex: 1 1 0;
            background-color: var(--colors-bg);
            color: var(--colors-fg);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .light {
                --colors-fg: #402020;
                --colors-dark-fg: #c0b3b3;
                --colors-bg: #fcf8f5;
                --colors-block-bg: #f7f0ec;
                --colors-img-trace: #d0c3c3;
                --colors-link: #6941e1;
                --colors-accent: #e2005a;

                --colors-comment: #706c6c;
                --colors-namespace: #786b6b;
                --colors-string: #d70c64;
                --colors-value: #007c60;
                --colors-keyword: #3838aa;
                --colors-function: #8d0f1b;
            }
            .dark {
                --colors-fg: #fcf8f5;
                --colors-dark-fg: #9f9393;
                --colors-bg: #4d4444;
                --colors-block-bg: #554a4a;
                --colors-img-trace: #2d1b1b;
                --colors-link: #b1afef;
                --colors-accent: #ff96b0;

                --colors-comment: #cbc1c1;
                --colors-namespace: #d3cfcd;
                --colors-string: #ffa1ca;
                --colors-value: #74cad3;
                --colors-keyword: #b7b7ff;
                --colors-function: #ecc2c6;
            }
        `}</style>
    </div>
);


const Colors: NextPage = () => (
    <div>
        <ThemeBlock theme="light" />
        <ThemeBlock theme="dark" />

        <style jsx>{`
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        `}</style>
    </div>
);


export default Colors;
