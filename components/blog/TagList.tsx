import {FC} from 'react';


export type Props = {
    tags: string[],
};


const TagList: FC<Props> = ({tags}) => (
    <ul>
        {tags.map(x => (
            <li key={x}><a href="">test article</a></li>
        ))}

        <style jsx>{`
            ul {
                margin: 0;
                padding: 0;
            }
            li {
                display: inline-block;
                border: 1px solid #322;
                border-radius: 4px;
                margin: 2px 4px;
                position: relative;
            }
            li a {
                position: relative;
                color: #eee;
                text-decoration: none;
                display: inline-block;
                padding: 2px 4px;
                transition: color .1s ease;
            }
            a:focus {
                outline: none;
            }
            li:hover a, li:focus-within a {
                color: #322;
            }
            li::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: #322;
                transition: height .1s ease;
            }
            li:hover::before, li:focus-within::before {
                height: 0;
            }
        `}</style>
    </ul>
);


export default TagList;
