import { FC } from 'react';
import dynamic from 'next/dynamic';


export type Props = {
    className?: string;
};


const Code: FC<Props> = ({ children, className }) => {
    if (!className || !className.startsWith('language-')) {
        return (<code className={className}>{children}</code>);
    }
    const lang = className.replace('language-', '');

    const NoHighlightCode = () => (<code>{children}</code>);
    const HighlightCode = dynamic(
        () => import('~/components/HighlightCode'),
        { loading: NoHighlightCode },
    );

    return (
        <HighlightCode lang={lang}>{
            children as string
        }</HighlightCode>
    );
};


export default Code;
