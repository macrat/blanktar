import {FC} from 'react';

import Tombo from '../Tombo';
import Header, {Props as HeaderProps} from './Header';


export type Props = HeaderProps;


const Article: FC<Props> = (props) => (
    <Tombo>
        <article aria-labelledby={props.title ? "article-title" : undefined}>
            <Header {...props} />

            {props.children}
        </article>

        <style jsx>{`
            article {
                padding-bottom: 3mm;
            }
        `}</style>
    </Tombo>
);


export default Article;
