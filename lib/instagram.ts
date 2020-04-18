import fetch from 'node-fetch';

import Image from '~/lib/image';


export type Photo = {
    url: string;
    image: {
        mdpi: string;
        hdpi: string;
        srcSet: string;
    };
    trace: {
        path: string;
        viewBox: string;
    };
    width: number;
    height: number;
    caption: string;
};


type RawInstagramResponse = {
    data: {
        id: string;
        permalink: string;
        media_url: string;
        caption: string;
    }[];
};


const fetchInstagram: (() => Promise<Photo[]>) = async () => {
    const resp = await fetch(`https://graph.facebook.com/v6.0/17841404490434454/media?fields=caption,media_url,permalink&limit=20&access_token=${process.env.INSTAGRAM_TOKEN}`);

    if (!resp.ok) {
        throw new Error(`failed to fetch Instagram data: ${resp.status} ${resp.statusText}`);
    }

    const {data}: RawInstagramResponse = await resp.json();

    return await Promise.all(data.map(async post => {
        const img = await Image.read(post.media_url);

        return {
            ...img.size,
            url: post.permalink,
            image: await img.optimize('photos', 480),
            trace: await img.trace(),
            caption: post.caption,
        };
    }));
};


export default fetchInstagram;
