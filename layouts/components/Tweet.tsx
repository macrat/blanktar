import React, {FC} from 'react';


const Tweet: FC = ({children}) => (
    <>
        <blockquote className="twitter-tweet">{children}</blockquote>
        <script async src="https://platform.twitter.com/widgets.js" />
    </>
);


export default Tweet;
