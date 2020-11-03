import { FC } from 'react';
import Link from 'next/link';
import { OutboundLink } from 'react-ga';


export type Props = {
    href: string;
};


const AutoLink: FC<Props> = ({ href, children }) => (
    href.startsWith('/') ? (
        <Link href={href}><a>{children}</a></Link>
    ) : href.startsWith('#') ? (
        <a href={href}>{children}</a>
    ) : (
        <OutboundLink eventLabel={String(children)} to={href} target="_blank">{children}</OutboundLink>
    )
);


export default AutoLink;
