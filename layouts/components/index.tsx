import {FC} from 'react';
import {MDXProvider} from '@mdx-js/react';

import Code from './Code';
import Hr from './Hr';
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
    hr: Hr,
    inlineCode: InlineCode,
    pre: Pre,
    code: Code,
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
