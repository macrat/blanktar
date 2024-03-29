---
title: Vercel Now（旧ZEIT Now）上でnode-canvasを動かす
pubtime: 2020-05-03T15:46:00+09:00
tags: [Vercel, Node.js]
description: Vercel NowにデプロイしたNode.jsのプロジェクトでnode-canvasを使う方法です。node-canvasはpure-jsではないので、依存関係を手動で解決してあげる必要があります。
faq:
  - question: Vercel Nowでnode-canvasを動かすには？
    answer: ビルド時にlibuuid-develとlibmount-develをインストールすれば動くようになります。
  - question: Vercel Nowでnpm run buildする前に好きなコマンドを実行するには？
    answer: package.jsonのscriptsにnow-buildというコマンドを用意しておくと、npm run buildの代わりにnpm run now-buildを使ってくれます。
---

このサイトでは、記事のサムネイルなんかを作るために[node-canvas](https://github.com/Automattic/node-canvas)を使用しています。
で、サーバには[Vercel Now](https://vercel.com/)を使っています。

node-canvasにはいくつかの共有ライブラリへの依存があるのですが、以下のものはNow上では使用出来ません。

- libuuid.so
- libmount.so
- libblkid.so

なので、何も考えずのnode-canvasをimportしようとすると以下のようなエラーが出てしまいます。

```
undefined	ERROR	Error: libuuid.so.1: cannot open shared object file: No such file or directory
    at Object.Module._extensions..node (internal/modules/cjs/loader.js:807:18)
    at Module.load (internal/modules/cjs/loader.js:653:32)
    at tryModuleLoad (internal/modules/cjs/loader.js:593:12)
    at Function.Module._load (internal/modules/cjs/loader.js:585:3)
    at Module.require (internal/modules/cjs/loader.js:692:17)
    at require (internal/modules/cjs/helpers.js:25:18)
    at Object.<anonymous> (/var/task/node_modules/canvas/lib/bindings.js:3:18)
    at Module._compile (internal/modules/cjs/loader.js:778:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)
    at Module.load (internal/modules/cjs/loader.js:653:32)
```

しかたがないので、これらを解決してあげる必要があります。

依存関係を解決するためのコマンドは以下のような感じ。
これが`npm run build`する前に動いてくれればOKです。

``` shell
$ yum install libuuid-devel libmount-devel
$ cp /lib64/{libuuid,libmount,libblkid}.so.1 node_modules/canvas/build/Release/
```

これを実行してもらうために、**package.json**を以下のように編集します。

``` json
{
  "scripts": {
    "now-build": "yum install libuuid-devel libmount-devel && cp /lib64/{libuuid,libmount,libblkid}.so.1 node_modules/canvas/build/Release/ && npm run build"

    // ...そのほか色々...
  }
}
```

scriptsに`now-build`っていうのを入れておくと、`build`の代わりに使ってくれるみたいです。
これを利用して、さきほどのコマンドを実行している感じ。

あとは通常通り、node-canvasが使えるようになっているはずです。

---

参考: [node-canvas runtime error · Issue #3460 · zeit/now](https://github.com/zeit/now/issues/3460)
