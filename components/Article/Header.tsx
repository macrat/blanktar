import {FC} from 'react';

import TagList from './TagList';
import BreadList, {Props as BreadListProps} from './BreadList';


const date2str = (t: Date) => (
    `${t.getFullYear()}/${t.getMonth() + 1}/${t.getDate()} ${t.getHours()}:${String(t.getMinutes()).padStart(2, '0')}`
);


export type Props = {
    pubtime?: Date,
    title?: string,
    tags?: string[],
    breadlist?: BreadListProps['pages'],
};


const ArticleHeader: FC<Props> = ({pubtime, title, tags, breadlist}) => (
    <header>
        {breadlist ? <BreadList pages={breadlist} /> : null}
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
                margin: 0 0 .5rem;
                ${breadlist ? "" : "padding: 2.5rem 0 0;"}
                line-height: 1em;
            }
            time {
                display: block;
                font-size: 120%;
                font-weight: 200;
                margin: .5rem 0 0;
                position: absolute;
                top: -2mm;
                right: 5mm;
            }
        `}</style>
    </header>
);


export default ArticleHeader;
