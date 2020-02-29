import {FC} from 'react';

import TagList from './TagList';


const date2str = (t: Date) => (
    `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`
);


export type Props = {
    pubtime?: Date,
    title?: string,
    tags?: string[],
};


const ArticleHeader: FC<Props> = ({pubtime, title, tags}) => (
    <header>
        {pubtime ? <time dateTime={pubtime.toISOString()}>{date2str(pubtime)}</time> : null}
        {title ? <h1>{title}</h1> : null}
        {tags ? <TagList tags={tags} /> : null}

        <style jsx>{`
            header {
                margin-bottom: 2em;
            }
            h1 {
                font-size: 48pt;
                font-weight: 100;
                margin: -.3rem 0 .5rem;
                padding: 0;
                line-height: 1em;
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


export default ArticleHeader;
