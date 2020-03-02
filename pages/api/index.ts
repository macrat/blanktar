import fm from 'front-matter';
import fs from 'fs';
import {ApolloServer, gql} from 'apollo-server-micro';


const blogBase = './pages/blog';

const posts: {
    title: string,
    pubtime: Date,
    tags: string[],
    href: string,
}[] = [];

for (let year of fs.readdirSync(blogBase)) {
    if (!year.match(/^[0-9]{4}$/)) continue;

    for (let month of fs.readdirSync(`${blogBase}/${year}`)) {
        if (!month.match(/^0[1-9]|1[0-2]$/)) continue;

        for (let file of fs.readdirSync(`${blogBase}/${year}/${month}`)) {
            if (!file.match(/\.mdx?$/)) continue;

            const path = `${blogBase}/${year}/${month}/${file}`;

            type Meta = {
                title: string,
                pubtime: string,
                tags: string[],
            };
            const meta: Meta = fm(fs.readFileSync(path, 'utf8')).attributes as Meta;

            posts.push({
                ...meta,
                pubtime: new Date(meta.pubtime),
                href: path.replace(/^.\/pages|\.mdx?$/g, ''),
            });
        }
    }
}


const typeDefs = gql`
    type Post {
        title: String!
        pubtime: String!
        tags: [String]!
        href: String!
    }

    type FilteredPosts {
        posts: [Post]!
        count: Int!
        totalCount: Int!
    }

    type Query {
        blog(year: Int, month: Int, offset: Int = 0, limit: Int = 20): FilteredPosts
    }
`;


const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
        Query: {
            blog: (obj, args) => {
                let resp = posts;

                if (args.year) resp = resp.filter(x => x.pubtime.getFullYear() === args.year);
                if (args.month) resp = resp.filter(x => x.pubtime.getMonth() + 1 === args.month);

                return {
                    posts: resp.slice(args.offset, args.offset + args.limit).map(x => ({
                        ...x,
                        pubtime: x.pubtime.toISOString(),
                    })),
                    count: Math.min(resp.length, args.limit),
                    totalCount: resp.length,
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
