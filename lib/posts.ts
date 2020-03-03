import fetch from 'isomorphic-unfetch';


export type PageData = {
    title: string,
    pubtime: string,
    href: string,
};


export type Opts = {
    year?: number,
    month?: number,
    desc?: boolean,
    page?: number,
    limit?: number,
};


export type Response = {
    posts: PageData[],
    totalCount: number,
};


export default async function(origin?: string, {year, month, desc=false, page=1, limit=1000}: Opts = {}): Promise<Response> {
    page--;

    const payload = 'posts{title,pubtime,href},totalCount';
    let query = `{blog(desc:${desc},offset:${page * limit},limit:${limit}){${payload}}}`;

    if (year && month) {
        query = `{blog(year:${year},month:${month},desc:${desc},offset:${page * limit},limit:${limit}){${payload}}}`;
    }

    if (year) {
        query = `{blog(year:${year},desc:${desc},offset:${page * limit},limit:${limit}){${payload}}}`;
    }

    const resp = await fetch(`${origin ? 'http://' + origin : ''}/api?query=${query}`);

    return (await resp.json()).data.blog;
};
