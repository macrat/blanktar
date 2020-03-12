import fetch from 'isomorphic-unfetch';


export type PageData = {
    title: string,
    pubtime: string,
    modtime: string | null,
    href: string,
    tags: string[],
    description: string | null,
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
        order: opts.desc ? 'DESC' : 'ASC',
        offset: (opts.page ?? 0) * (opts.limit ?? 1000),
        desc: undefined,
        page: undefined,
    };

    const query = Object.entries(sendOpts).filter(([k, v]) => v).map(([k, v]) => `${k}:${v}`).join(',');

    return `{posts(${query}){posts{title,pubtime,modtime,href,tags,description},totalCount}}`;
};


export default async function(origin?: string, {year, month, desc=false, page=0, limit=1000}: Opts = {}): Promise<Response> {
    const resp = await fetch(`${origin ? 'http://' + origin : ''}/api?query=${makeQuery({year, month, desc, page, limit})}`);

    if (!resp.ok) {
        throw new Error(`${resp.statusText}: ${await resp.text()}`);
    }

    return (await resp.json()).data.posts;
};


export async function search(origin: string | undefined, query: string, page: number = 0): Promise<Response> {
    const resp = await fetch(`${origin ? 'http://' + origin : ''}/api?query={search(query:${JSON.stringify(query)},offset:${page * 20},limit:20){posts{title,pubtime,modtime,href,tags,description},totalCount}}`);

    if (!resp.ok) {
        throw new Error(`${resp.statusText}: ${await resp.text()}`);
    }

    return (await resp.json()).data.search;
}


export async function searchTitle(origin: string | undefined, query: string): Promise<{title: string, href: string}[]> {
    const resp = await fetch(`${origin ? 'http://' + origin : ''}/api?query={search(query:${JSON.stringify(query)},limit:5,target:TITLE){posts{title,href}}}`);

    if (!resp.ok) {
        throw new Error(`${resp.statusText}: ${await resp.text()}`);
    }

    return (await resp.json()).data.search.posts;
}
