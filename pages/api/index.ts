import {ApolloServer, gql} from 'apollo-server-micro';

import posts, {Post} from '../../lib/server/posts';


for (let i = 0; i < posts.length; i++) {
    posts[i].previous = posts[i - 1];
    posts[i].next = posts[i + 1];
}


const typeDefs = gql`
    """
    A single post.
    """
    type Post @cacheControl(maxAge: 604800) {
        title: String!

        "ISO8601 style timestamp when article published"
        pubtime: String!

        "ISO8601 style timestamp when article modified"
        modtime: String

        "tags (keywords) of the post"
        tags: [String!]!

        "URL path to article without origin"
        href: String!

        "body of article in markdown"
        content: String!

        description: String

        "Path to eye-catch image"
        image: String

        previous: Post @cacheControl(maxAge: 86400)

        next: Post @cacheControl(maxAge: 86400)
    }

    """
    List of posts.
    """
    type Posts @cacheControl(maxAge: 86400) {
        posts: [Post!]!
        count: Int!
        totalCount: Int!
    }

    """
    The order type for search list.
    """
    enum Order {
        ASC
        DESC
    }

    """
    The target of search.
    """
    enum SearchTarget {
        ALL
        TITLE
    }

    type Query {
        post(href: String!): Post
        posts(year: Int, month: Int, order: Order = ASC, offset: Int = 0, limit: Int = 20): Posts!
        search(query: String!, target: SearchTarget = ALL, order: Order = ASC, offset: Int = 0, limit: Int = 20): Posts!
    }
`;


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
