import Image, { TracedImage } from '~/lib/image';


export type Photo = {
    image: string;
    width: number;
    height: number;
    url: string;
    trace: TracedImage;
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


const fetchInstagram = async (): Promise<Photo[]> => {
    const resp = await fetch(`https://graph.facebook.com/v6.0/17841404490434454/media?fields=caption,media_url,permalink&limit=20&access_token=${process.env.PHOTOS_INSTAGRAM_TOKEN}`);

    if (!resp.ok) {
        throw new Error(`failed to fetch Instagram data: ${resp.status} ${resp.statusText}`);
    }

    const { data }: RawInstagramResponse = await resp.json();

    return await Promise.all(data.map(async post => {
        const url = post.media_url.replace(/scontent-[a-z]{3}[0-9]-[0-9]\./, 'scontent.');
        const img = await Image.download(url);

        return {
            ...(await img.size()),
            image: url,
            url: post.permalink,
            trace: await img.trace(),
            caption: post.caption,
        };
    }));
};


export default fetchInstagram;
