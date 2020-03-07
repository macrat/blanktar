import {FC} from 'react';
import {MDXProvider} from '@mdx-js/react';

import Code from './Code';
import Hr from './Hr';
import Image from './Image';
import InlineCode from './InlineCode';
import PS from './PS';
import Pre from './Pre';
import Table from './Table';
import Td from './Td';
import Th from './Th';
import Tr from './Tr';


export type Props = {};


const components = {
    PS: PS,

    code: Code,
    hr: Hr,
    img: Image as FC,
    inlineCode: InlineCode,
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
