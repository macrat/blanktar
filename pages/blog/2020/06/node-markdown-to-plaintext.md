---
title: Node.jsでMarkdownをplain textに変換する
pubtime: 2020-06-09T22:12:00+09:00
tags: [Node.js, JavaScript, ライブラリの紹介]
description: Node.jsを使って、Markdownのマークアップを削除してプレーンテキストに変換する方法です。依存関係は無いようなので、ブラウザでも動くはずです。
faq:
  - question: Node.jsでMarkdownをplain textにするには?
    answer: remove-markdownというライブラリを使うと簡単そうです。
---

このサイトに機能追加をする過程で、Markdownのマークアップを削除してplain textにしたい所がありました。
このサイトはNext.jsで出来ているので、Node.js/JavaScriptでの開発になります。


# やりたいこと

やりたいのは、以下のようなMarkdownのデータがあったとして、

``` markdown
# タイトルとか
**強調**とか[リンク](https://blanktar.jp)とか。
```

これを、以下のようなプレーンテキストに変換する作業です。

```
タイトルとか
強調とかリンクとか。
```


# やりかた

軽く調べてみたところ、[remove-markdown](https://www.npmjs.com/package/remove-markdown)というnpmパッケージを使うのが楽そうです。

``` shell
$ npm i -s markdown-remove
```

使い方は、最小限だと以下のような感じです。

``` javascript
import removeMd from 'remove-markdown';


const markdown = `
# タイトルとか
**強調**とか[リンク](https://blanktar.jp)とか。
`;

const plain = removeMd(markdown);

console.log(plain);
// output:
//  タイトルとか
//  強調とかリンクとか。
```

こんな感じ。
かなりシンプルに実装出来ます。

第二引数のオプションで、gfm対応を無効にしたり画像のaltを表示しないようにしたりの指定が出来るようです。

``` javascript
const plain = removeMd(markdown, {
    stripListLeaders: true,  // リストの先頭の - とか * とかを消すかどうか。
    listUnicodeChar: '',     // リストの頭に使う文字。その名の通りunicodeが使える。
    gfm: true,               // GitHub-Flavored Markdownに対応させるかどうか。
    useImgAltText: true,     // 画像のalt部分を出力に含めるかどうか。
});
```

随分更新が無いのが気になるといえばなりますが、お手軽で良い感じです。
