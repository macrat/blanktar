import React, { FC } from 'react';


const ListItem: FC = ({ children }) => (
    <li>
        {children}

        <svg width="100%" height="1px" className="horizontal top" aria-hidden="true"><rect x="0" y="0" width="100%" height="100%" /></svg>
        <svg width="100%" height="1px" className="horizontal bottom" aria-hidden="true"><rect x="0" y="0" width="100%" height="100%" /></svg>
        <svg width="1px" height="100%" className="vertical left" aria-hidden="true"><rect x="0" y="0" width="100%" height="100%" /></svg>
        <svg width="1px" height="100%" className="vertical right" aria-hidden="true"><rect x="0" y="0" width="100%" height="100%" /></svg>

        <style jsx>{`
            li {
                display: block;
                position: relative;
                margin: 5mm 0;
            }
            svg {
                position: absolute;
                fill: var(--colors-fg);
                transition: transform .3s;
            }
            .top {
                top: 0;
            }
            .bottom {
                bottom: 0;
            }
            .left {
                left: 0;
            }
            .right {
                right: 0;
            }
            .horizontal {
                left: -3mm;
                width: calc(100% + 6mm);
                transform: scaleX(0);
            }
            .vertical {
                top: -3mm;
                height: calc(100% + 6mm);
                transform: scaleY(0);
            }
            li:hover .horizontal, li:focus-within .horizontal {
                transform: scaleX(1);
            }
            li:hover .vertical, li:focus-within .vertical {
                transform: scaleY(1);
            }

            @media (prefers-reduced-motion: reduce) {
                svg {
                    opacity: 0;
                    transition: opacity .2s ease;
                }
                li:hover svg, li:focus-within svg {
                    opacity: 1;
                    animation: none;
                }
            }
        `}</style>
    </li>
);


export default ListItem;
