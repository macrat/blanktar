import React, {FC} from 'react';


const ListItem: FC = ({children}) => (
    <li>
        <svg width="100%" height="1px" className="line top"><rect x="0" y="0" width="100%" height="100%" /></svg>
        <svg width="1px" height="100%" className="line left"><rect x="0" y="0" width="100%" height="100%" /></svg>

        {children}

        <svg width="100%" height="1px" className="line bottom"><rect x="0" y="0" width="100%" height="100%" /></svg>
        <svg width="1px" height="100%" className="line right"><rect x="0" y="0" width="100%" height="100%" /></svg>

        <style jsx>{`
            li {
                display: block;
                position: relative;
                margin: 5mm 0;
            }
            .line {
                display: none;
                position: absolute;
            }
            rect {
                fill: var(--colors-fg);
            }
            .bottom {
                bottom: 0;
            }
            .right {
                top: 0;
                right: 0;
            }
            li:hover .line, li:focus-within .line {
                display: block;
            }
            li:hover .top, li:focus-within .top { animation: line-horizontal .3s ease both; }
            li:hover .left, li:focus-within .left { animation: line-vertical .3s ease both; }
            li:hover .bottom, li:focus-within .bottom { animation: line-horizontal .3s ease both; }
            li:hover .right, li:focus-within .right { animation: line-vertical .3s ease both; }

            @keyframes line-horizontal {
                from { transform: scaleX(0); }
                  to { transform: scaleX(1); }
            }
            @keyframes line-vertical {
                from { transform: scaleY(0); }
                  to { transform: scaleY(1); }
            }

            @media screen and (prefers-reduced-motion: reduce) {
                .line {
                    display: block;
                    opacity: 0;
                    transition: opacity .2s ease;
                }
                li:hover .line, li:focus-within .line {
                    opacity: 1;
                    animation: none;
                }
            }
        `}</style>
    </li>
);


export default ListItem;
