import { FC, memo } from 'react';
import Link from 'next/link';


const Footer: FC = () => (
    <footer>
        <small role="contentinfo">
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

            @media print  {
                a {
                    display: none;
                }
            }
        `}</style>
    </footer>
);


export default memo(Footer, () => true);
