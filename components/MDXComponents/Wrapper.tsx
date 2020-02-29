import {FC} from 'react';
import {useRouter} from 'next/router';

import Article from '../Article';


export type Props = {
    meta: {
        title: string,
        pubtime: string,
        tags: string[],
    }[],
};


const BlogWrapper: FC<Props> = ({children, meta: {title, pubtime, tags}}) => {
    const router = useRouter();
    const ptime = new Date(pubtime);

    return (
        <Article
            title={title}
            pubtime={ptime}
            tags={tags}
            breadlist={[{
                title: 'blog',
                href: '/blog',
            }, {
                title: `${ptime.getFullYear()}`,
                href: '/blog/[year]',
                as: `/blog/${ptime.getFullYear()}`,
            }, {
                title: `${String(ptime.getMonth() + 1).padStart(2, '0')}`,
                href: '/blog/[year]/[month]',
                as: `/blog/${ptime.getFullYear()}/${String(ptime.getMonth() + 1).padStart(2, '0')}`,
            }, {
                title: title,
                href: router.asPath,
            }]}>

            {children}
        </Article>
    );
};


export default BlogWrapper;
