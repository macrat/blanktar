import {FC} from 'react';

import TagList from './TagList';
import BreadList, {Props as BreadListProps} from './BreadList';
import {date2str} from '../DateTime';


export type Props = {
    pubtime?: Date,
    title?: string,
    tags?: string[],
    breadlist?: BreadListProps['pages'],
};


const ArticleHeader: FC<Props> = ({pubtime, title, tags, breadlist}) => (
    <header>
        {pubtime ? <time dateTime={pubtime.toISOString()}>{date2str(pubtime)}</time> : null}
        {breadlist ? <BreadList pages={breadlist} /> : null}
        {title ? <h1>{title}</h1> : null}
        {tags ? <TagList tags={tags} /> : null}

        <style jsx>{`
            header {
                margin-bottom: 2em;
            }
            h1 {
                font-size: 42pt;
                font-weight: 100;
                margin: 0 0 .5rem;
                ${breadlist ? "" : "padding: 2.5rem 0 0;"}
                line-height: 1em;
                transition: font-size .6s ease;
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
            @media screen and (max-width: 40em) {
                h1 {
                    font-size: 36pt;
                }
            }
            @media screen and (max-width: 30em) {
                time {
                    position: initial;
                    text-align: right;
                }
            }
        `}</style>
    </header>
);


export default ArticleHeader;
