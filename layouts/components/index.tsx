import {FC} from 'react';
import {MDXProvider} from '@mdx-js/react';

import Code from './Code';
import Hr from './Hr';
import Image from './Image';
import InlineCode from './InlineCode';
import Link from './Link';
import PS from './PS';
import Pre from './Pre';
import Script from './Script';
import Table from './Table';
import Td from './Td';
import Th from './Th';
import Tr from './Tr';
import {H1, H2, H3} from './headings';


export type Props = {};


const components = {
    PS: PS,
    Script: Script,

    code: Code,
    h1: H1,
    h2: H2,
    h3: H3,
    hr: Hr,
    img: Image as FC,
    inlineCode: InlineCode,
    a: Link as FC,
    pre: Pre,
    table: Table,
    td: Td as FC,
    th: Th as FC,
    tr: Tr,
};


const MDXComponentsProvider: FC<Props> = ({children}) => (
    <MDXProvider components={components}>
        {children}
    </MDXProvider>
);


export default MDXComponentsProvider;
