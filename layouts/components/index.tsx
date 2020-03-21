import {FC} from 'react';
import {MDXProvider} from '@mdx-js/react';
import css from 'styled-jsx/macro';

import Code from './Code';
import Image from './Image';
import InlineCode from './InlineCode';
import Link from './Link';
import PS from './PS';
import Script from './Script';
import {H1, H2, H3} from './headings';


const {className, styles} = css.resolve`
    div :global(hr) {
        margin: 1cm auto;
        width: 15cm;
        max-width: 100%;
        height: .2mm;
        border: none;
        background-color: var(--colors-fg);
    }

    div :global(pre) {
        padding: 5mm;
        overflow: auto;
        background-color: var(--colors-block-bg);
    }

    div :global(table) {
        border-collapse: collapse;
    }

    div :global(td) {
        padding: 1mm 4mm;
        border: 0 solid var(--colors-dark-fg);
        border-width: 0 .2mm;
    }
    div :global(td:first-of-type), div :global(td:last-of-type) {
        border-width: 0;
    }

    div :global(th) {
        padding: 1mm 4mm;
        border: 0 solid var(--colors-dark-fg);
        border-width: 0 .2mm;
        border-bottom: .2mm solid var(--colors-fg);
    }
    div :global(th:first-of-type), div :global(th:last-of-type) {
        border-width: 0 0 .2mm;
    }

    div :global(tr) {
        border: 0 solid var(--colors-fg);
        border-width: .2mm 0;
    }
    div :global(tr:first-of-type), div :global(tr:last-of-type) {
        border-width: 0;
    }
`;


export type Props = {};


const components = {
    PS: PS,
    Script: Script,

    code: Code,
    h1: H1,
    h2: H2,
    h3: H3,
    img: Image as FC,
    inlineCode: InlineCode,
    a: Link as FC,
};


const MDXComponentsProvider: FC<Props> = ({children}) => (
    <div className={className}>
        <MDXProvider components={components}>
            {children}
        </MDXProvider>

        {styles}
    </div>
);


export default MDXComponentsProvider;
