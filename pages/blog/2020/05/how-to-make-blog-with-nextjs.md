---
title: Next.js + MDXでブログを作る 〜 Blanktarの場合
pubtime: 2020-05-09T16:05:00+09:00
tags: [Next.js, Node.js, JavaScript]
description: このブログはNext.jsとMDXを使って作られています。Next.jsはブログ用というわけではないので、少し工夫が必要な箇所がありました。この記事は、その工夫をまとめたものです。
---

このブログは[MDX](https://mdxjs.com/)で書かれていて、それを[Next.js](https://nextjs.org/)でサイトにしています。
Next.jsはブログ用に作られたものではないので、少し工夫が必要な箇所がありました。
というわけで、その工夫のまとめです。

- [FrontMatter付きのMDXの記事をNext.jsに読み込む](#FrontMatter付きのMDXの記事をNext.jsに読み込む)
- [記事一覧ページを作る](#記事一覧ページを作る)
- [記事検索機能を付ける](#記事検索機能を付ける)


# FrontMatter付きのMDXの記事をNext.jsに読み込む

Next.jsでMDXを読み込みたい場合は[@next/mdx](https://www.npmjs.com/package/@next/mdx)というパッケージを使えば良い基本的にはOKです。
だた、私は[JekyllのFront Matter](http://jekyllrb-ja.github.io/docs/front-matter/)みたいなやつを使いたかったので、[next-mdx-enhanced](https://github.com/hashicorp/next-mdx-enhanced)に少し手を加えたものを使っています。

たとえばこの記事の書き出しは以下のような感じになっています。
ここに書いた情報を、記事のレイアウトや後述する記事一覧ページなどで使っていくことになります。
``` yaml
---
title: Next.js + MDXでブログを作る 〜 Blanktarの場合
pubtime: 2020-05-09T16:05:00+09:00
tags: [nextjs, mdx, nodejs, javascript, typescript, ブログ]
description: このブログはNext.jsとMDXを使って作られています。Next.jsはブログ用というわけではないので、少し工夫が必要な箇所がありました。この記事は、その工夫をまとめたものです。
---
```

ちなみに、FrontMatter無しでやろうとすると以下のような感じになるはず。
``` jsx
export const config = {
    amp: 'hybrid',
};

export const metadata = {
    title: 'Next.js + MDXでブログを作る 〜 Blanktarの場合',
    pubtime: new Date('2020-05-09T16:05:00+09:00'),
    tags: ['nextjs', 'mdx', 'nodejs', 'javascript', 'typescript', 'ブログ'],
    description: 'このブログはNext.jsとMDXを使って作られています。Next.jsはブログ用というわけではないので、少し工夫が必要な箇所がありました。この記事は、その工夫をまとめたものです。',
};
```

Front Matterを使った方がシンプルで好きです。
柔軟性はちょっと下がるので、どちらが良いかは好みかもしれませんが…。

このブログの場合は年別、月別のディレクトリに格納しているので、たとえばこの記事は`pages/blog/2020/05/how-to-make-blog-with-nextjs.mdx`みたいなファイル名で保存してあります。
個別の記事ページはこれをnext-mdx-enhancedが読み込んでページ化してくれるという流れになっています。


# 記事一覧ページを作る

個別ページが出来たら一覧ページ、なのですが、Next.jsには全ページのリストみたいなものを取得する機能がありません。
なので、[2020年5月の記事一覧](/blog/2020/05)みたいなものを簡単に生成する術がありません。

しかたがないので、以下のようなコードでがんばって読み込んでいます。
（[実際のもの](https://github.com/macrat/blanktar/blob/b68b0a5b0739b7567a58234919d9916d5ee51496/lib/posts/loader.js)よりかなり簡単にしてあります）

``` javascript
import fs from 'fs';
import frontmatter from 'front-matter';

const BLOG_BASE = './pages/blog';


export function getPosts() {
    const posts = [];

    for (const year of fs.readdirSync(BLOG_BASE)) {
        for (const month of fs.readdirSync(`${BLOG_BASE}/${year}`)) {
            for (const file of fs.readdirSync(`${BLOG_BASE}/${year}/${month}`)) {
                const path = `/${year}/${month}/${file}`;

                const article = frontmatter(fs.readFileSync(BLOG_BASE + path, 'utf8'));

                posts.push({
                    ...article.attributes,  // Front Matterの部分。記事一覧とかで使う。
                    body: article.body,     // 記事本体。後述する記事検索で使う。
                    href: '/blog' + path.replace(/\.mdx$/, ''),
                });
            }
        }
    }

    return posts;
}
```

これで記事の一覧が取得出来ます。
まあ、[nodeのfsモジュール](https://nodejs.org/api/fs.html)で頑張っているだけなのですが。

あとはこれで記事一覧を作れば完成…なのですが、ここで少し注意が必要な箇所があります。

[Vercel Now](https://vercel.com)にデプロイする時なんかに使うserverlessモードでは、1ページ1スクリプトにまとめてビルドされるようになっています。
そのスクリプトを1ページ分ずつ別々にデプロイするので、自分以外のファイルには触れることが出来ません。

簡単に言うと、**実行時にはファイルシステムに触れない**と考えてしまって良いと思います。

というわけで、`getPosts`は[`getServerSideProps`](https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)の中で呼び出すようにしましょう。
そうすればビルド時（= `npm run build`したとき）に実行してくれるので、上記の問題を回避することが出来ます。

コードにすると、記事一覧ページは以下のような感じになります。

``` jsx
import Link from 'next/link';

import { getPosts } from 'さっき作った記事一覧を取得するコード';


const BlogIndex = ({ posts }) => (
    <ul>
        {posts.map(p => (
            <li key={p.href}>
                <Link href={p.href}<a>{p.title}</a></Link>
            </li>
        ))}
    </ul>
);


export getServerSideProps = () => {
    return {
        props: {
            posts: getPosts(),
        },
    };
};


export default BlogIndex;
```


# 記事検索機能を付ける

記事検索をタグの代わりにしているので、全文検索を入れたかったのですが…
どうも、手軽に使えて精度が高そうなものを見つけられませんでした。

考えてみたらこのブログは300個くらいしか投稿が無いですし、全部合わせても1MBに届きません。
だったら普通にfor文回しても問題無いだろうと思い、そのような実装にしています。
実際右上の検索ボックスから試してみて頂いても、違和感の無い速度を体感出来るかと思います。

なので、検索用のコードは以下のような感じ。
（これも[実際のもの](https://github.com/macrat/blanktar/blob/b68b0a5b0739b7567a58234919d9916d5ee51496/lib/posts/search/index.ts)よりかなり簡略化しています。）

``` javascript
import { getPosts } from 'さっき作った記事一覧を取得するコード';


export function searchPosts(query) {
    return getPosts().filter(p => {
        x.body.includes(query),
    });
}
```

恐しく単純ですね。

ここまでは問題無いのですが、先ほども出た**実行時にはファイルシステムに触れない問題**が出てきます。
検索はどうやっても実行時やらざるをえないので、これがちょっと困った問題になります。

Blanktarでは、[preval.macro](https://github.com/kentcdodds/preval.macro)というモジュールを使うことでこの問題を回避しています。
このモジュールを使うと、「`getPosts`はビルド時に実行しておいて、`searchPosts`だけは実行時に実行する」みたいなことが出来るようになります。
C++のconstexprみたいなイメージ？

preval.macroを使ったコードは以下のようになります。

``` javascript
import preval from 'preval.macro';


const posts = preval`
    // この中に書いたコードはビルド時に実行される
    module.exports = require('さっき作った記事一覧を取得するコード').getPosts();
`;


export function searchPosts(query) {
    return posts.filter(p => {
        x.body.includes(query),
    });
}
```

これで、fsモジュールを使うのはビルド時だけになったので、問題無く検索出来るようになります。

---

工夫が必要といっても、ご覧の通りそんなに難しいことをしているわけではありません。
ちょっとやれば色々なものを作れるので楽で良いですよね、Next.js。
