const fs = require('fs');

const blogBase = './pages/blog';

const posts = (
    fs.readdirSync(blogBase)
        .filter(x => x.match(/[0-9]{4}/))
        .map(y => [
            y,
            fs.readdirSync(`${blogBase}/${y}`)
                .filter(x => x.match(/0[1-9]|1[0-2]/))
                .map(m => [
                    m,
                    fs.readdirSync(`${blogBase}/${y}/${m}`).filter(x => x.match(/\.mdx?$/)),
                ])
                .filter(m => m[1].length > 0)
                .reduce((xs, m) => ({
                    ...xs,
                    [m[0]]: m[1],
                }), {})
        ])
        .filter(y => Object.entries(y[1]).length > 0)
        .reduce((xs, y) => ({
            ...xs,
            [y[0]]: y[1],
        }), {})
);


const withMdxFm = require('next-mdx-frontmatter')({
    extension: /\.mdx?$/,
})


module.exports = withMdxFm({
    pageExtensions: ['tsx', 'md', 'mdx'],
    env: {
        posts: JSON.stringify(posts),
    },
});
