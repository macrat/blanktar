import fetch from 'isomorphic-unfetch';


export type PageData = {
    title: string,
    pubtime: string,
    href: string,
};


export default async (origin?: string, year?: number, month?: number) => {
    let query = '{blog(limit:1000){title,pubtime,href}}';

    if (year && month) {
        query = `{blog(year:${year},month:${month},limit:1000){title,pubtime,href}}`;
    }

    if (year) {
        query = `{blog(year:${year},limit:1000){title,pubtime,href}}`;
    }

    const resp = await fetch(`${origin ? 'http://' + origin : ''}/api?query=${query}`);

    return (await resp.json()).data.blog;
};
