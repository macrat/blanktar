import React from 'react';
import { NextPage, GetStaticProps, GetStaticPaths } from 'next';

import posts, { Post } from '~/lib/posts';


export const config = {
    amp: 'hybrid',
};


export type Props = {
    post: Post;
};


const Article: NextPage<Props> = ({ post }) => {
    return (
        <h1>{post.title}</h1>
    );
};


export const getStaticProps: GetStaticProps<Props, {year: string; month: string; file: string}> = async ({ params }) => {
    if (params === undefined) {
        throw new Error('params must be set');
    }

    const year = Number(params.year);
    const month = Number(params.month);

    const article = posts.filter((x) => x.year === year && x.month === month && x.file === params.file)[0];

    return {
        props: {
            post: article,
        },
    };
};


export const getStaticPaths: GetStaticPaths = async () => {
    return {
        fallback: false,
        paths: posts.map(x => ({
            params: {
                year: String(x.year),
                month: String(x.month).padStart(2, '0'),
                file: x.file,
            },
        })),
    };
};


export default Article;
