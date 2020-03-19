import {ApolloServer} from 'apollo-server-micro';
import {loader} from 'graphql.macro';

import posts, {Post} from '../../lib/server/posts';


for (let i = 0; i < posts.length; i++) {
    posts[i].previous = posts[i - 1];
    posts[i].next = posts[i + 1];
}


const typeDefs = loader('../../api/defs.graphql');


const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
        Query: {
            post: (obj, args) => {
                for (let p of posts) {
                    if (p.href === args.href) {
                        return p;
                    }
                }
                return null;
            },
            posts: (obj, args) => {
                let filtered = [...posts];

                if (args.year) filtered = filtered.filter(x => x.pubtime.getFullYear() === args.year);
                if (args.month) filtered = filtered.filter(x => x.pubtime.getMonth() + 1 === args.month);

                if (args.order === 'DESC') {
                    filtered.reverse();
                }

                const sliced = filtered.slice(args.offset, args.offset + args.limit).map(x => ({
                    ...x,
                    pubtime: x.pubtime.toISOString(),
                    modtime: x.modtime?.toISOString()
                }));

                return {
                    posts: sliced,
                    count: sliced.length,
                    totalCount: filtered.length,
                };
            },
            search: (obj, args) => {
                let filtered = posts;

                args.query.toLowerCase().split(' ').forEach((q: string) => {
                    const searcher = args.target === 'ALL' ? (
                        (x: Post) => (
                            x.lowerTitle.includes(q)
                            || x.lowerTags.includes(q)
                            || x.lowerContent.includes(q)
                        )
                    ) : (
                        (x: Post) => x.lowerTitle.includes(q)
                    );

                    filtered = filtered.filter(searcher);
                });

                if (args.order === 'DESC') {
                    filtered = [...filtered];

                    filtered.reverse();
                }

                const sliced = filtered.slice(args.offset, args.offset + args.limit).map(x => ({
                    ...x,
                    pubtime: x.pubtime.toISOString(),
                    modtime: x.modtime?.toISOString(),
                }));

                return {
                    posts: sliced,
                    count: sliced.length,
                    totalCount: filtered.length,
                };
            },
        },
    },
});


export default apolloServer.createHandler({path: '/api'});


export const config = {
    api: {
        bodyParser: false,
    },
};
