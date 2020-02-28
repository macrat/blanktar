export const posts: {
    [year: string]: {
        [month: string]: string[],
    },
} = JSON.parse(process.env.posts ?? '{}');


export default (year?: number, month?: number) => {
    if (!year && !month) {
        return Object.keys(posts);
    }

    if (!month) {
        return Object.keys(posts[String(year)]);
    }

    return posts[String(year)][String(month).padStart(2, '0')].map(x => x.replace(/\.mdx?$/, ''));
};
