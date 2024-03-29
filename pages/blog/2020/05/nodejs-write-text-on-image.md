---
title: Node.jsで画像に文字を書く
pubtime: 2020-05-03T02:01:00+09:00
tags: [Node.js, JavaScript, Canvas, 画像処理]
description: node-canvasというライブラリを使って、Node.jsで画像に日本語の文字を書く方法です。ブラウザのcanvasと同じAPIが実装されてるので、canvasを使ったことがあるなら簡単に使えると思います。
howto:
  totalTime: PT10M
  step:
    - name: node-canvasをインストールする
      url: "#1. 必要なパッケージのインストール"
      text: "`npm install canvas`でnode-canvasというライブラリをインストールします。"
      image: /blog/2020/05/nodejs-write-text-on-image-step1.png
    - name: フォントを読み込む
      url: "#5-1. フォントの読み込み"
      text: |
        `registerFont(fontPath, { family: fontName })`を使って、使いたいフォントを読み込みます。
        otfもttfも行けるので、わりと何でも読めるはず。
      image: /blog/2020/05/nodejs-write-text-on-image-step2.png
    - name: キャンバスの準備をする
      url: "#2. Canvasを用意する"
      text: "`createCanvas(width, height)`を使って、空のキャンバスを作ります。"
      image: /blog/2020/05/nodejs-write-text-on-image-step3.png
    - name: コンテキストを作る
      url: "#2. Canvasを用意する"
      text: "`canvas.getContext('2d')`でキャンバスの操作をするためのコンテキストを作ります。"
      image: /blog/2020/05/nodejs-write-text-on-image-step4.png
    - name: 画像を読み込む
      url: "#3. 画像を読み込む"
      text: "`await loadImage(imagePath)`で書き込み先となる画像を読み込みます"
      image: /blog/2020/05/nodejs-write-text-on-image-step5.png
    - name: 画像をキャンバスに書き込む
      url: "#3. 画像を読み込む"
      text: "`context.drawImage(image, left, top)`で読み込んだ画像をキャンバスに書き込みます。"
      image: /blog/2020/05/nodejs-write-text-on-image-step6.png
    - name: 使うフォントの名前を指定する
      url: "#5-2. 使うフォントを指定して文字を書き込む"
      text: "`context.font = fontName`でさきほど読み込んだ（familyで指定した）フォントの名前を指定します。"
      image: /blog/2020/05/nodejs-write-text-on-image-step7.png
    - name: 文字を書き込む
      url: "#5-2. 使うフォントを指定して文字を書き込む"
      text: "`context.fillText(text, left, top)`で文字を書き込みます。"
      image: /blog/2020/05/nodejs-write-text-on-image-step7.png
---

地味に進めていたこのサイトのリニューアルもほぼ完了しました。

新しいサイトはSNS対応([OGP](https://ogp.me/)ってやつ)をきっちりしてみたかったのですが、このためには記事1つ1つにアイキャッチ画像の設定が必要でした。
ただまあ、テキストとソースコードがほとんどのこのブログで画像を毎回作るのも面倒くさくて…

というわけで、Node.jsでコンテンツと一緒に生成させるようにしてみました。

具体的には、以下のような画像を読み込んで、

![Blanktarって文字とロゴだけが入った画像](/blog/2020/05/eyecatch-base-image.svg "144x144")

以下のように記事のタイトルを入れるものを作りました。

![「Node.jsで画像に文字を書く」って記事タイトルを重ねた画像](/blog/2020/05/eyecatch-output-image.png "144x144")

# 1. 必要なパッケージのインストール

今回は[node-canvas](https://www.npmjs.com/package/canvas)というライブラリを使用しました。
その名の通り、[HTMLのCanvas API](https://developer.mozilla.org/ja/docs/Web/API/Canvas_API)をNode.js上で使えるようにしてくれるやつです。

``` shell
$ npm install canvas
```

環境によっては依存関係を手動でインストールする必要があるので、問題があれば[GitHub上のREADME](https://github.com/Automattic/node-canvas/blob/master/Readme.md)を確認してください。


# 2. Canvasを用意する

まずは[createCanvas](https://github.com/Automattic/node-canvas/blob/master/Readme.md#createcanvas)という関数を使って、画像編集をするためのキャンバスの用意をします。
このキャンバスに色々書き込んでいく流れになります。

``` javascript
import { createCanvas } from 'canvas';


const canvas = createCanvas(640, 480);  // 640x480の空のキャンバスを作る
// const canvas = document.querySelector('#canvas');  // 上の一行はブラウザの場合のコレに相当します

const ctx = canvas.getContext('2d');  // ここからはブラウザと共通
```


# 3. 画像を読み込む

次に、書き込み先となる画像を読み込みます。
画像の読み込みには[Imageクラス](https://github.com/Automattic/node-canvas/blob/master/Readme.md#imagesrc)を使うか、そのヘルパ関数である[loadImage](https://github.com/Automattic/node-canvas/blob/master/Readme.md#loadimage)を使います。

## loadImage関数を使う場合（簡単）

``` javascript
import { loadImage } from 'canvas';


const image = await loadImage('./path/to/image.jpg');  // ここはURLを渡しても平気

ctx.drawImage(image, 0, 0, 640, 480);  // さっき作ったCanvasの(0, 0)地点に640x480のサイズで描画
```

## Imageクラスを使う場合（色々出来る？）

``` javascript
import { Image } from 'canvas';


const image = new Image();

image.src = './path/to/image.jpg';  // ここはURLでも良い（loadImageと一緒）

image.onerror = (err) => {
    console.error(err);
};

image.onload = () => {
    ctx.drawImage(image, 0, 0, 640, 480);  // さっき作ったCanvasの(0, 0)地点に640x480のサイズで描画
};
```


# 4. 文字を書き込む（英数字だけバージョン）

書き込み先の画像の準備が出来たら、いよいよ文字を書き込みます。
まずはフォントを気にしなくて良い英数字だけの文字列から。

``` javascript
ctx.fillText('hello world', 10, 10);  // (10, 10)の位置に"hello world"を書き込む
```

これだけで書き込みが出来ます。

このあたりの挙動はブラウザのCanvas APIと全く一緒なので、[MDNあたりのリファレンス](https://developer.mozilla.org/ja/docs/Web/API/CanvasRenderingContext2D/fillText)が参考になると思います。


# 5. 文字を書き込む（日本語バージョン）

## 5-1. フォントの読み込み

日本語（というかASCII文字以外）を書き込みたい場合は、まず始めにフォントの読み込みをする必要があります。
これには、[registerFont](https://github.com/Automattic/node-canvas/blob/master/Readme.md#registerfont)という関数を使います。

ちなみに、**registerFontの呼び出しはcreateCanvasを呼び出す前に**やらないとダメみたいです。

``` javascript
import { registerFont } from 'canvas';


registerFont('./path/to/font.ttf', { family: 'Hoge Fuga' });  // font.ttfを登録する。フォント名は適当
```

これで登録が出来ます。
**ttf**も**otf**も読めるので、かなりつよい。

URLの指定は出来ないので、そこだけ注意。

## 5-2. 使うフォントを指定して文字を書き込む

フォントの登録が完了したら、以下のようにして使うフォントを指定して書き込みます。
この辺はブラウザと一緒。

``` javascript
ctx.font = '12px "Hoge Fuga"';  // フォントサイズとさっき指定したフォント名

ctx.fillText('日本語が使える！', 10, 10);
```
