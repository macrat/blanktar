import {FC} from 'react';
import Link from 'next/link';
import {outboundLink} from 'react-ga';


export type Props = {
    href: string,
};


const AutoLink: FC<Props> = ({href, children}) => (
    href.startsWith('/') ? (
        <Link href={href}><a>{children}</a></Link>
    ) : href.startsWith('#') ? (
        <a href={href}>{children}</a>
    ) : (
        <a href={href} target="_blank" rel="noopener" onClick={() => outboundLink({label: String(children)}, () => {})}>{children}</a>
    )
);


export default AutoLink;
