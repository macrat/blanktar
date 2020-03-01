import {FC} from 'react';
import Highlight, {defaultProps, Language} from 'prism-react-renderer';
import githubTheme from 'prism-react-renderer/themes/github';


const theme = {
    ...githubTheme,
    plain: {
        color: undefined,
        backgroundColor: undefined,
    },
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
