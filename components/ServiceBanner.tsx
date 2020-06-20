import React, { FC } from 'react';


export type Props = {
    name: string;
    href: string;
    viewBox: string;
    path: string;
};


const ServiceBanner: FC<Props> = ({ name, href, viewBox, path }) => (
    <div>
        <a href={href} target="_blank" rel="noopener noreferrer">
            <h2>
                <svg viewBox={viewBox} aria-hidden="true">
                    <path fillRule="evenodd" d={path} />
                </svg>
                {name}
            </h2>
        </a>

        <style jsx>{`
            div {
                display: flex;
                justify-content: center;
            }
            h2 {
                display: flex;
                align-items: center;
                font-size: 48pt;
                font-weight: 200;
                margin: 0;
                transition: font-size .2s ease;
            }
            @media screen and (max-width: 40em) {
                h2 {
                    font-size: 38pt;
                }
            }
            a {
                color: inherit;
                text-decoration: none;
            }
            a:hover, a:focus {
                color: inherit;
            }
            svg {
                margin-right: .2em;
                width: 1em;
                height: 1em;
            }
            path {
                fill: var(--colors-fg);
            }
        `}</style>
    </div>
);


export default ServiceBanner;
