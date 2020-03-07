import {FC} from 'react';
import Link from 'next/link';

import colors from '../../lib/colors';


export type Props = {
    tags: string[],
};


const TagList: FC<Props> = ({tags}) => (
    <ul>
        {tags.map(x => (
            <li key={x}><Link href={{pathname: '/search', query: {q: x}}}><a>{x}</a></Link></li>
        ))}

        <style jsx>{`
            ul {
                display: block;
                margin: 0 -4px;
                padding: 0;
            }
            li {
                display: inline-block;
                border: 1px solid ${colors.fg};
                border-radius: 4px;
                margin: 2px 4px;
                position: relative;
            }
            li a {
                position: relative;
                color: ${colors.bg};
                text-decoration: none;
                display: inline-block;
                padding: 2px 4px;
                transition: color .1s ease;
            }
            a:focus {
                outline: none;
            }
            li:hover a, li:focus-within a {
                color: ${colors.fg};
            }
            li::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: ${colors.fg};
                transition: height .1s ease;
            }
            li:hover::before, li:focus-within::before {
                height: 0;
            }
        `}</style>
    </ul>
);


export default TagList;
