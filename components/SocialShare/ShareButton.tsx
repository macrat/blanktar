import { FC } from 'react';
import { event } from 'react-ga';


export type Props = {
    href: string;
    alt: string;
    label: string;
};


const ShareButton: FC<Props> = ({ href, alt, label, children }) => (
    <a
        href={href}
        rel="noopener noreferrer nofollow"
        target="_blank"
        title={alt}
        onClick={() => event({
            category: 'Social',
            action: 'Share',
            label: label,
        })}>

        <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="512"
            height="512"
            viewBox="0 0 512 512"
            role="img"
            aria-label={alt}>

            {children}
        </svg>

        <style jsx>{`
            a {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 38px;
                width: 72px;
                background-color: var(--colors-dark-fg);
                position: relative;
                overflow: hidden;
            }
            a::before {
                content: '';
                position: absolute;
                top: -10%;
                left: -10%;
                width: 120%;
                height: 120%;
                background-color: var(--colors-bg);
                transform: scaleY(0);
                transition: transform .2s ease;
            }
            a:hover::before, a:focus::before {
                transform: scaleY(1);
            }
            svg {
                height: 26px;
                width: auto;
                position: relative;
            }
            svg :global(path), svg :global(rect) {
                fill: var(--colors-bg);
            }
            a:hover :global(path), a:focus :global(path),
            a:hover :global(rect), a:focus :global(rect) {
                fill: var(--colors-fg);
            }
            @media screen and (max-width: 480px) {
                a {
                    width: 60px;
                }
            }
            @media screen and (max-width: 380px) {
                a {
                    width: 72px;
                }
            }
        `}</style>
    </a>
);


export default ShareButton;
