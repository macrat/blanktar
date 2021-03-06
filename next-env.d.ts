/// <reference types="next" />
/// <reference types="next/types/global" />

declare namespace JSX {
    interface AmpImg {
        alt: string;
        src: string;
        srcset?: string;
        sizes?: string;
        width: string;
        height: string;
        layout?: string;
        style?: {
            [key: string]: string | number;
        };
        children?: Element;
    }
    interface AmpTwitter {
        'data-tweetid': string;
        width: number;
        height: number;
        children?: ReactNode;
    }
    interface AmpAnalytics {
        type: string;
        'data-credentials': string;
        key?: string;
        children: ReactNode;
    }
    interface IntrinsicElements {
        'amp-img': AmpImg;
        'amp-twitter': AmpTwitter;
        'amp-analytics': AmpAnalytics;
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
        [key in ComponentType]?: React.ComponentType<{children: React.ReactNode; className?: string}>;
    };

    export interface MDXProviderProps {
        children: React.ReactNode;
        components: Components;
    }

    export class MDXProvider extends React.Component<MDXProviderProps> {
    }
}

declare module 'prism-react-renderer/prism' {
    import { PrismLib } from 'prism-react-renderer';

    const Prism: PrismLib;

    export default Prism;
}

declare module 'styled-jsx/macro' {
    export { resolve } from 'styled-jsx/css';
}

declare module 'potrace' {
    interface Params {
        turdSize?: number;
        color?: string;
        background?: string;
    }

    interface Potrace {
        readonly setParameters: (params: Params) => void;
        readonly getSVG: () => string;
        readonly getPathTag: () => string;
        readonly loadImage: (image: string | Buffer, callback: (err?: Error) => void) => void;
    }

    export class Potrace extends Potrace {
    }
}

declare module 'imagemin-zopfli' {
    interface Options {
        transparent?: boolean;
    }

    const imageminZopfli: (opts: Options) => (buf: Buffer) => Promise<Buffer>;

    export default imageminZopfli;
}
