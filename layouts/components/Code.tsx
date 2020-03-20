import {FC} from 'react';

import HighlightCode from '../../components/HighlightCode';


export type Props = {
    className?: string,
};


const Code: FC<Props> = ({children, className}) => {
    if (!className || !className.startsWith('language-')) {
        return (<code className={className}>{children}</code>);
    }
    const lang = className.replace('language-', '');

    return (
        <HighlightCode lang={lang}>{
            children as string
        }</HighlightCode>
    );
};


export default Code;
