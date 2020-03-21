import {FC} from 'react';
import Link from 'next/link';


export type Props = {
    href: string,
};


const AutoLink: FC<Props> = ({href, children}) => (
    href.startsWith('/') ? (
        <Link href={href}><a>{children}</a></Link>
    ) : (
        <a href={href} target="_blank" rel="noopener">{children}</a>
    )
);


export default AutoLink;