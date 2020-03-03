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


const makeQuery: ((opts: Opts) => string) = opts => {
    const sendOpts: {[key: string]: string | number | boolean | undefined} = {
        ...opts,
        offset: (opts.page ?? 0) * (opts.limit ?? 1000),
        page: undefined,
    };

    const query = Object.entries(sendOpts).filter(([k, v]) => v).map(([k, v]) => `${k}:${JSON.stringify(v)}`).join(',');

    return `{blog(${query}){posts{title,pubtime,href},totalCount}}`;
};


export default async function(origin?: string, {year, month, desc=false, page=0, limit=1000}: Opts = {}): Promise<Response> {
    const resp = await fetch(`${origin ? 'http://' + origin : ''}/api?query=${makeQuery({year, month, desc, page, limit})}`);

    if (!resp.ok) {
        throw new Error(`${resp.statusText}: ${await resp.text()}`);
    }

    return (await resp.json()).data.blog;
};
