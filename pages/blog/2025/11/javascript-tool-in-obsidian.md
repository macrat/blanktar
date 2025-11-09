---
title: Obsidianの中でHTMLとJavaScriptを使った小さなツールを作ってみた
description: Obsidianはとても便利なノートアプリです。あまりにも便利なので常に開いています。常に開いているならちょっとしたツールもObsidianの中で動かせたら更に便利なのではと思い、HTMLとJavaScriptを使った小さなツールを作ってみました。簡単なツールを動かすにはとても良い実行環境かもしれません。
pubtime: 2025-11-09T15:33:00+09:00
tags: [Obsidian]
---

[Obsidian](https://obsidian.md/)というノートアプリがあります。
Markdownで個人Wikiのようなものを作ることができるアプリで、非常にシンプルな基本設計と、非常に強力な拡張性のおかげでとても使い勝手が良いツールです。
私も昨年から使い始めたのですが、いまではすっかり仕事にも私生活にも欠かせない存在になりました。

Obsidianはちょっとしたメモを取ることに便利なので、基本的にPCを開いているときは常にObsidianも開いています。
そうなってくると、せっかくならちょっとしたツールもObsidianの中で動かしたくなってきます。
Markdown形式でノートを書くわけですから、HTMLやJavaScriptでツールを作ることも不可能ではないように思われます。

というわけで、HTMLの`<script>`タグを使って簡単なツールを作ってみたのですが……残念ながら、[Obsidianはscriptタグの実行を許可してくれない](https://publish.obsidian.md/help-ja/%E9%AB%98%E5%BA%A6%E3%81%AA%E3%83%88%E3%83%94%E3%83%83%E3%82%AF/HTML%E3%81%AE%E3%82%B5%E3%83%8B%E3%82%BF%E3%82%A4%E3%82%BA)ようです。

それでもどうしてもJavaScriptのコードを動かしたい。というわけで、[Dataview](https://blacksmithgu.github.io/obsidian-dataview/)というプラグインの機能を流用してみることにしました。
このプラグインはObsidian内のノートをデータベースのように使うためのものなのですが、その中にはJavaScriptコードを使って表示内容や動作を自由に記述できる[dataviewjs](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/)という機能があります。

このdataviewjsを使うと、以下のようにして任意のJavaScriptコードを実行できます。

````markdown
```dataviewjs
const elm = dv.el("div", "hello world");  // elmには`<div><span>hello world</span></div>`のような要素が入る。
elm.style.color = "red";  // 操作は普通のHTMLDivElementと同じ。
```
````

これを実行すると、赤字で"hello world"と表示されるはずです。

[`dv.el(element, text)`](https://blacksmithgu.github.io/obsidian-dataview/api/code-reference/#dvelelement-text)関数は、`document.createElement()`に近いイメージで使うことができます。
この関数で作った要素は自動的にノート内に表示されるので、あとは普通にJavaScriptで操作すればOKです。

`dv.el()`以外にもいろいろな便利関数があるのですが、JavaScriptでツールを自作したいようなおかしな用途をするなら`<div>`要素が1つあれば十分でしょう。
中身は生JSで好き勝手に書いていきます。

ちなみに、コードは該当のコードブロックが表示されたときに実行されます。
ライブエディタモードの場合はよくわからないタイミングで実行されることがあるので、何度実行されても安全なコードにするべきでしょう。
[`sessionStorage`](https://developer.mozilla.org/ja/docs/Web/API/Window/sessionStorage)などのブラウザストレージも使えるので、必要に応じて状態を保存しておくと良いかもしれません。

この方法の実験のために、簡単な時計ウィジェットを作ってみました。

````markdown
```dataviewjs
const elm = dv.el('div');
elm.style = 'background-color:#333;display:flex;justify-content:center;align-items:center';
elm.innerHTML = `
  <svg viewbox="0 0 20 10" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <text x="10" y="5.5" dominant-baseline="middle" text-anchor="middle" font-size="4" fill="#999" style="font-weight:bold"><tspan id="dh">--</tspan> <tspan id="dm">--</tspan></text>
    <line x1="10" y1="5" x2="10" y2="2" stroke="#877" stroke-width="0.4" stroke-linecap="round" id="ah" />
    <line x1="10" y1="5" x2="10" y2="0.3" stroke="#877" stroke-width="0.2" stroke-linecap="round" id="am" />
  </svg>
`;

const ah = elm.querySelector('#ah');
const am = elm.querySelector('#am');
const dh = elm.querySelector('#dh');
const dm = elm.querySelector('#dm');


function update() {
  const now = new Date();

  const minute = now.getMinutes() / 60;
  const hour = (now.getHours() % 12 + minute) / 12;

  ah.setAttribute('transform', `rotate(${hour * 360} 10 5)`);
  am.setAttribute('transform', `rotate(${minute * 360} 10 5)`);

  const zfill = (num) => num.toString().padStart(2, '0');
  dh.textContent = zfill(now.getHours());
  dm.textContent = zfill(now.getMinutes());

  setTimeout(update, 60000 - now.getSeconds() * 1000 - now.getMilliseconds());
}
update();
```
````

上記のコードをObsidianに貼り付けると、以下のような時計が表示されます。

<div class="clock-example" style="background-color:#333;display:flex;justify-content:center;align-items:center;width:600px;max-width:100%">
  <svg viewbox="0 0 20 10" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
    <text x="10" y="5.5" dominant-baseline="middle" text-anchor="middle" font-size="4" fill="#999" style="font-weight:bold"><tspan id="dh">--</tspan> <tspan id="dm">--</tspan></text>
    <line x1="10" y1="5" x2="10" y2="2" stroke="#877" stroke-width="0.4" stroke-linecap="round" id="ah" />
    <line x1="10" y1="5" x2="10" y2="0.3" stroke="#877" stroke-width="0.2" stroke-linecap="round" id="am" />
  </svg>
</div>

<script>
  (() => {
    const elm = document.querySelector('.clock-example');
    const ah = elm.querySelector('#ah');
    const am = elm.querySelector('#am');
    const dh = elm.querySelector('#dh');
    const dm = elm.querySelector('#dm');

    function update() {
      const now = new Date();

      const minute = now.getMinutes() / 60;
      const hour = (now.getHours() % 12 + minute) / 12;

      ah.setAttribute('transform', `rotate(${hour * 360} 10 5)`);
      am.setAttribute('transform', `rotate(${minute * 360} 10 5)`);

      const zfill = (num) => num.toString().padStart(2, '0');
      dh.textContent = zfill(now.getHours());
      dm.textContent = zfill(now.getMinutes());

      setTimeout(update, 60000 - now.getSeconds() * 1000 - now.getMilliseconds());
    }
    update();
  })();
</script>

上記の時計はコンセプト実証のために作ったものですが、Obsidian内の任意の場所に時計を表示できるので、案外と重宝しています。

そのほかにも、パスワード生成ツールや、外部ツールのAPIをキックするためのボタンなど、「ぱっと使えると便利」だけど「どこかにデプロイするほどではない」という性質のツールをいくつか作って使ってみています。
Obsidianの「すぐ手の届くところにある」という性質と相性が良く、これらも思ったよりも便利に使えています。

自分用のちょっとしたツールの保存/実行場所として、Obsidianは良い選択肢になるかもしれません。
