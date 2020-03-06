import fm from 'front-matter';
import fs from 'fs';
import {ApolloServer, gql} from 'apollo-server-micro';


const blogBase = './pages/blog';

type Post = {
    title: string,
    lowerTitle: string,
    pubtime: Date,
    tags: string[],
    lowerTags: string[],
    image?: string,
    description?: string,
    href: string,
    content: string,
    lowerContent: string,
    previous?: Post,
    next?: Post,
};

export const posts: Post[] = [];

for (let year of fs.readdirSync(blogBase)) {
    if (!year.match(/^[0-9]{4}$/)) continue;

    for (let month of fs.readdirSync(`${blogBase}/${year}`)) {
        if (!month.match(/^0[1-9]|1[0-2]$/)) continue;

        for (let file of fs.readdirSync(`${blogBase}/${year}/${month}`)) {
            if (!file.match(/\.mdx$/)) continue;

            const path = `${blogBase}/${year}/${month}/${file}`;

            type Meta = {
                title: string,
                pubtime: string,
                tags: string[],
                image?: string,
                description?: string,
            };
            const article = fm(fs.readFileSync(path, 'utf8'));
            const meta: Meta = article.attributes as Meta;

            posts.push({
                ...meta,
                lowerTitle: meta.title.toLowerCase(),
                lowerTags: meta.tags.map(x => x.toLowerCase()),
                pubtime: new Date(meta.pubtime),
                href: `/blog${path.slice(blogBase.length, -'.mdx'.length)}`,
                content: article.body,
                lowerContent: article.body.toLowerCase(),
            });
        }
    }
}

posts.sort((x, y) => {
    if (x.pubtime > y.pubtime) return 1;
    if (x.pubtime < y.pubtime) return -1;
    return 0;
});

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

        "ISO8601 style timestamp"
        pubtime: String!

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

    type Query {
        post(href: String!): Post
        posts(year: Int, month: Int, order: Order = ASC, offset: Int = 0, limit: Int = 20): Posts!
        search(query: String!, order: Order = ASC, offset: Int = 0, limit: Int = 20): Posts!
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
                    filtered = posts.filter(x => (
                        x.lowerTitle.includes(q)
                        || x.lowerTags.includes(q)
                        || x.lowerContent.includes(q)
                    ));
                });

                if (args.order === 'DESC') {
                    filtered = [...filtered];

                    filtered.reverse();
                }

                const sliced = filtered.slice(args.offset, args.offset + args.limit).map(x => ({
                    ...x,
                    pubtime: x.pubtime.toISOString(),
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
