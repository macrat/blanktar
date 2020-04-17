import React, {FC} from 'react';
import Prism from 'prism-react-renderer/prism';
import Highlight, {defaultProps, Language} from 'prism-react-renderer';

import './language-supports';


export type Props = {
    children: string;
    lang: string;
};


const classNameMap: {[key: string]: string} = {
    comment: 'comment',
    prolog: 'comment',
    doctype: 'comment',
    cdata: 'comment',

    namespace: 'namespace',

    string: 'string',
    'attr-value': 'string',
    punctuation: 'string',

    entity: 'value',
    url: 'value',
    symbol: 'value',
    number: 'value',
    boolean: 'value',
    constant: 'value',
    property: 'value',
    regex: 'value',
    inserted: 'value',

    atrule: 'keyword',
    keyword: 'keyword',
    'attr-name': 'keyword',
    selector: 'keyword',

    function: 'function',
    deleted: 'function',
    tag: 'function',
    variable: 'function',
    'function-variable': 'function',
};


const HighlightCode: FC<Props> = ({children, lang}) => (
    <>
        <Highlight
            {...defaultProps}
            Prism={Prism}
            code={children.slice(0, -1)}
            language={lang as Language}>

            {({tokens, getTokenProps}) => (
                <code>
                    {tokens.map((line, i) => (
                        <div key={i}>
                            {line.map((token, key) => {
                                const {className, children} = getTokenProps({token, key});
                                return <span key={key} className={classNameMap[className.split('token ')[1]]}>{children}</span>
                            })}
                        </div>
                    ))}
                </code>
            )}
        </Highlight>

        <style jsx>{`
            span {
                display: inline-block;
            }
            .comment {
                color: var(--colors-comment);
                font-style: italic;
            }
            .namespace {
                color: var(--colors-namespace);
            }
            .string {
                color: var(--colors-string);
            }
            .value {
                color: var(--colors-value);
            }
            .keyword {
                color: var(--colors-keyword);
            }
            .function {
                color: var(--colors-function);
            }
        `}</style>
    </>
);


export default HighlightCode;
