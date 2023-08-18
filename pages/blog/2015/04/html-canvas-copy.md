---
title: HTML5のcanvasの中身をコピー
pubtime: 2015-04-18T16:37:00+09:00
tags: [HTML5, Canvas, JavaScript]
description: HTML5のcanvasを使ってお絵描きした内容を、そのまままるごとコピーする方法です。結構簡単に出来るみたいです。
---

[先ほどの記事](/blog/2015/04/html-canvas-paint)に引き続いてHTML5のcanvasです。
お絵描きをしたcanvasの中身を別のcanvasにコピーしよう、と言う感じ。

とりあえずサンプル。

<canvas width="320" height="240" style="border: 1px solid black; background-color: white" id="alpha"></canvas>
<canvas width="320" height="240" style="border: 1px solid black; background-color: white" id="beta"></canvas>
<button>コピー</button>
<script>
(() => {
    const alpha = document.getElementById('alpha');
    const beta = document.getElementById('beta');
    const alphacontext = alpha.getContext('2d');
    alpha.addEventListener('mousedown', ev => {
        alphacontext.beginPath();
        alphacontext.moveTo(ev.offsetX, ev.offsetY);
    });
    alpha.addEventListener('mousemove', ev => {
        if (ev.which) {
            alphacontext.lineTo(ev.offsetX, ev.offsetY);
            alphacontext.stroke();
        }
    });
    document.querySelector('button').addEventListener('click', ev => {
        const image = alphacontext.getImageData(0, 0, alpha.width, alpha.height);
        beta.getContext('2d').putImageData(image, 0, 0);
    });
})()
</script>

左のカンバスは絵を描ける。コピーってボタンをクリックすると内容をコピーできる。

``` html
<html>
    <canvas width=320 height=240 style="border: 1px solid black" id=alpha></canvas>
    <canvas width=320 height=240 style="border: 1px solid black" id=beta></canvas>
    <button>コピー</button>

    <script>
        var alpha = document.querySelector('#alpha');
        var beta = document.querySelector('#beta');
        var context = alpha.getContext('2d');

        alpha.addEventListener('mousedown', function(ev){
            context.beginPath();
            context.moveTo(ev.offsetX, ev.offsetY);
        });

        alpha.addEventListener('mousemove', function(ev){
            if(ev.which){
                context.lineTo(ev.offsetX, ev.offsetY);
                context.stroke();
            }
        });

        document.querySelector('button').addEventListener('click', function(ev){
            var image = context.getImageData(0, 0, alpha.width, alpha.height);
            beta.getContext('2d').putImageData(image, 0, 0);
        });
    </script>
</html>
```
ソースコードはこんな。
contextの`getImageData`でカンバスの中身を画像化して、そいつを`putImageData`で貼り付ける。
結構お手軽？

<ins datetime="2023-08-18T22:33">

# 2023-08-18 追記

2023年現在の環境で動くように若干コードを修正しました。

修正前は `ev.layerX` / `ev.layerY` を使用していたものを、 `ev.offsetX` / `ev.offsetY` を使用するように変更してあります。

</ins>
