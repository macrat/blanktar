import {FC} from 'react';


export type Props = {
    href: string,
};


const ViewMore: FC<Props> = ({href}) => (
    <a href={href}>
        もっと見る

        <style jsx>{`
            display: inline-block;
            margin: 5mm 0 0;
            padding: 2mm 3mm;
            font-size: 130%;
            position: relative;
            overflow: hidden;
            color: var(--colors-fg);
            text-decoration: none;

            ::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--colors-fg);
                transform: scaleY(0);
                transition: transform .2s ease;
            }
            :hover, :focus {
                color: var(--colors-bg);
            }
            :hover::before, :focus::before {
                transform: scaleY(1);
                z-index: -1;
            }
            @media screen and (prefers-reduced-motion: reduce) {
                ::before {
                    opacity: 0;
                    transform: scaleY(1);
                    transition: opacity .2s ease;
                }
                :hover::before, :focus::before {
                    opacity: 1;
                }
            }
        `}</style>
    </a>
);


export default ViewMore;
