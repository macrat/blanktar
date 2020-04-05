/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace JSX {
    interface AmpImg {
        className?: string;
        alt?: string;
        src: string;
        srcset?: string,
        sizes?: string,
        width: string;
        height: string;
        layout?: string;
        style?: {
            [key: string]: string | number,
        };
        fallback?: boolean;
        children?: Element;
    }
    interface IntrinsicElements {
        'amp-img': AmpImg;
    }
}

declare module '@mdx-js/react' {
    import * as React from 'react';

    type ComponentType =
        | 'a'
        | 'blockquote'
        | 'code'
        | 'delete'
        | 'em'
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'
        | 'hr'
        | 'img'
        | 'inlineCode'
        | 'li'
        | 'ol'
        | 'p'
        | 'pre'
        | 'strong'
        | 'sup'
        | 'table'
        | 'td'
        | 'thematicBreak'
        | 'tr'
        | 'ul';

    export type Components = {
        [key in ComponentType]?: React.ComponentType<{children: React.ReactNode, className?: string}>
    };

    export interface MDXProviderProps {
        children: React.ReactNode,
        components: Components,
    };

    export class MDXProvider extends React.Component<MDXProviderProps> {};
}

declare module 'prism-react-renderer/prism' {
    import {PrismLib} from 'prism-react-renderer';

    const Prism: PrismLib;

    export default Prism;
}

declare module 'styled-jsx/macro' {
    import {resolve} from 'styled-jsx/css';

    export const resolve = resolve;
}
