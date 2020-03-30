import {FC} from 'react';
import Prism from 'prism-react-renderer/prism';
import Highlight, {defaultProps, Language} from 'prism-react-renderer';

import './language-supports';

import theme from './theme';


export type Props = {
    children: string,
    lang: string,
};


const HighlightCode: FC<Props> = ({children, lang}) => (
    <Highlight
        {...defaultProps}
        Prism={Prism}
        code={children.slice(0, -1)}
        language={lang as Language}
        theme={theme}>

        {({className, style, tokens, getLineProps, getTokenProps}) => (
            <code className={className} style={{...style}}>
                {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({line, key: i})}>
                        {line.map((token, key) => (
                            <span key={key} {...getTokenProps({token, key})} />
                        ))}
                    </div>
                ))}
            </code>
        )}
    </Highlight>
);


export default HighlightCode;
