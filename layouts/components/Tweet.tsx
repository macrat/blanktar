import React, {FC} from 'react';
import Head from 'next/head';
import { useAmp } from 'next/amp';


type Props = {
    id: string;
}


const Tweet: FC<Props> = ({id, children}) => {
    if (useAmp()) {
        return (
            <>
                <Head>
                    <script async custom-element="amp-twitter" src="https://cdn.ampproject.org/v0/amp-twitter-0.1.js" key="script--amp-twitter" />
                </Head>

                <amp-twitter data-tweetid={id} width={500} height={600}>
                    <blockquote placeholder="placeholder">
                        {children}
                    </blockquote>
                </amp-twitter>
            </>
        );
    }

    return (
        <>
            <blockquote className="twitter-tweet">{children}</blockquote>
            <script async src="https://platform.twitter.com/widgets.js" />
        </>
    );
};


export default Tweet;
