import {FC} from 'react';

import TagList from './TagList';


const date2str = (t: Date) => (
    `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`
);


export type Props = {
    pubtime: Date,
    title: string,
    tags: string[],
};


const BlogHeader: FC<Props> = ({pubtime, title, tags}) => (
    <header>
        <time dateTime={pubtime.toISOString()}>{date2str(pubtime)}</time>
        <h1>{title}</h1>
        <TagList tags={tags} />

        <style jsx>{`
            header {
                margin-bottom: 2em;
            }
            h1 {
                font-size: 48pt;
                font-weight: 100;
                margin: -1.2rem 0 -.5rem;
                padding: 0;
            }
            time {
                display: inline-block;
                margin-left: 1em;
                font-size: 120%;
                font-weight: 200;
            }
        `}</style>
    </header>
);


export default BlogHeader;
