import {FC} from 'react';
import {MDXProvider} from '@mdx-js/react';

import Wrapper from './Wrapper';
import Hr from './Hr';
import InlineCode from './InlineCode';
import PS from './PS';
import Pre from './Pre';


export type Props = {};


const components = {
    wrapper: Wrapper,
    PS: PS,
    hr: Hr,
    inlineCode: InlineCode,
    pre: Pre,
};


const MDXComponentsProvider: FC<Props> = ({children}) => (
    <MDXProvider components={components}>
        {children}
    </MDXProvider>
);


export default MDXComponentsProvider;
