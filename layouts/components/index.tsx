import {FC} from 'react';
import {MDXProvider} from '@mdx-js/react';

import Code from './Code';
import Hr from './Hr';
import InlineCode from './InlineCode';
import PS from './PS';
import Pre from './Pre';


export type Props = {};


const components = {
    PS: PS,
    hr: Hr,
    inlineCode: InlineCode,
    pre: Pre,
    code: Code,
};


const MDXComponentsProvider: FC<Props> = ({children}) => (
    <MDXProvider components={components}>
        {children}
    </MDXProvider>
);


export default MDXComponentsProvider;
