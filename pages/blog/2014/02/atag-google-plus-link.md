---
title: google+の共有ボタンをaタグだけで作る
pubtime: 2014-02-28T16:35:00+09:00
tags: [Web, HTML]
description: google+で共有するボタンを、javascriptを使わずにaタグだけでWebサイトに設置する方法です。
---

うちのサイトにはちょいちょいソーシャルリンクが貼ってあります。
javascriptとかキモチワルイので、リンク自体はaタグで作ってます。ポップアップさせるのに結局javascript使ってるんだけれどね、仕方がない。

twitterとfacebookについては[ソーシャルっぽいものに対応](/blog/2013/01/support-social)をご覧ください。

たとえば[http://blanktar.jp/](http://blanktar.jp/)にリンクするときは、
```
https://plusone.google.com/_/+1/confirm?hl=ja&url=http://blanktar.jp/
```
こんな感じのURLを使います。

実際に使うときは、
``` html
<a href="https://plusone.google.com/_/+1/confirm?hl=ja&amp;url=http://blanktar.jp/">+1</a></pre>
```
みたいな感じかな。

---

参考:
- <a href="https://developers.google.com/+/web/share/?hl=ja" target="_blank">共有 - Google+ Platform &mdash; Google Developers</a>
- <a href="http://d-esign.net/web/archives/240" target="_blank">&lt;a&gt;タグとボタン画像で実装するシンプルなソーシャルボタン | webMemorand</a>
