import fetch from 'isomorphic-unfetch';


export type PageData = {
    title: string,
    pubtime: string,
    href: string,
};


export default async (origin?: string, year?: number, month?: number) => {
    let query = '{blog{title,pubtime,href}}';

    if (year && month) {
        query = `{blog(year:${year},month:${month}){title,pubtime,href}}`;
    }

    if (year) {
        query = `{blog(year:${year}){title,pubtime,href}}`;
    }

    const resp = await fetch(`${origin ? 'http://' + origin : ''}/api?query=${query}`);

    return (await resp.json()).data.blog;
};
