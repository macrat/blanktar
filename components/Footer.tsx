import {FC, memo} from 'react';
import Link from 'next/link';


export type Props = {};


const Footer: FC<Props> = () => (
    <footer>
        <small>
            <Link href="/privacy-policy"><a>プライバシーポリシー</a></Link>
            <span>&copy; 2012- MacRat All rights reserved.</span>
        </small>

        <style jsx>{`
            footer {
                text-align: center;
            }
            a, span {
                display: inline-block;
                color: var(--colors-fg);
                opacity: .7;
                margin: 0 2mm;
            }
        `}</style>
    </footer>
);


export default memo(Footer, () => true);
