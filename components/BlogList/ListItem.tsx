import {FC} from 'react';


export type Props = {
};


const ListItem: FC<Props> = ({children}) => (
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
                overflow: hidden;
            }
            .line {
                display: none;
                position: absolute;
            }
            .line rect {
                fill: var(--colors-fg);
            }
            .line.bottom {
                bottom: 0;
            }
            .line.right {
                top: 0;
                right: 0;
            }
            li:hover .line, li:focus-within .line {
                display: block;
            }
            li:hover .line.top, li:focus-within .line.top { animation: line-horizontal .4s ease both; }
            li:hover .line.left, li:focus-within .line.left { animation: line-vertical .1s ease both; }
            li:hover .line.bottom, li:focus-within .line.bottom { animation: line-horizontal .4s ease .1s both; }
            li:hover .line.right, li:focus-within .line.right { animation: line-vertical .1s ease .4s both; }

            @keyframes line-horizontal {
                from { transform: translate(-100%, 0); }
                  to { transform: translate(0, 0); }
            }
            @keyframes line-vertical {
                from { transform: translate(0, -100%); }
                  to { transform: translate(0, 0); }
            }

            @media screen and (prefers-reduced-motion: reduce) {
                .line {
                    display: block;
                    opacity: 0;
                    transition: opacity .2s ease;
                }
                li:hover svg.line, li:focus-within svg.line {
                    opacity: 1;
                    animation: none;
                }
            }
        `}</style>
    </li>
);


export default ListItem;