import {FC} from 'react';
import Prism from 'prism-react-renderer/prism';
import Highlight, {defaultProps, Language, PrismTheme} from 'prism-react-renderer';

import './prism-language-supports';


const theme: PrismTheme = {
    plain: {
        color: undefined,
        backgroundColor: undefined,
    },
    styles: [{
        types: ['comment', 'prolog', 'doctype', 'cdata'],
        style: {
            color: 'var(--colors-comment)',
            fontStyle: 'italic',
        },
    }, {
        types: ['namespace'],
        style: {
            color: 'var(--colors-namespace)',
        },
    }, {
        types: ['string', 'attr-value'],
        style: {
            color: 'var(--colors-string)',
        },
    }, {
        types: ['punctuation', 'operator'],
        style: {
            color: 'var(--colors-string)',
        },
    }, {
        types: ['entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'property', 'regex', 'inserted'],
        style: {
            color: 'var(--colors-value)',
        },
    }, {
        types: ['tag', 'atrule', 'keyword', 'attr-name', 'selector'],
        style: {
            color: 'var(--colors-keyword)',
        },
    }, {
        types: ['function', 'deleted', 'tag'],
        style: {
            color: 'var(--colors-function)',
        },
    }, {
        types: ['function-variable'],
        style: {
            color: 'var(--colors-variable)',
        },
    }],
};


export type Props = {
    className?: string,
};


const Code: FC<Props> = ({children, className}) => {
    if (!className || !className.startsWith('language-')) {
        return (<code className={className}>{children}</code>);
    }
    const lang = className.replace('language-', '');

    return (
        <code><Highlight
            {...defaultProps}
            Prism={Prism}
            code={(children as string).slice(0, -1)}
            language={lang as Language}
            theme={theme}>

            {({className, style, tokens, getLineProps, getTokenProps}) => (
                <pre className={className} style={{...style}}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({line, key: i})}>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({token, key})} />
                            ))}
                        </div>
                    ))}

                    <style jsx>{`
                        pre {
                            margin: 0;
                        }
                    `}</style>
                </pre>
            )}
        </Highlight></code>
    );
};


export default Code;
