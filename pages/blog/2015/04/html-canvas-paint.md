---
title: HTML5のcanvasでお絵描きしてみた。
pubtime: 2015-04-18T16:05:00+09:00
tags: [HTML5, Canvas, JavaScript]
description: HTML5のcanvasを使用して、簡単なお絵描きツールのようなものを作ってみました。結構色々遊べそうです。
---

HTML5のcanvasは結構いい感じで、結構遊べるようです。Flashがいらなくなるって話も頷けるね。

実際に動くサンプルがこんなん。

<canvas id="canvaspaint" width="640" height="480" style="border: 1px solid black; background-color: white"></canvas>
<script type="text/javascript">
(() => {
    const canvas = document.getElementById('canvaspaint');
    const context = canvas.getContext('2d');
    canvas.addEventListener('mousedown', ev => {
        context.beginPath();
        context.moveTo(ev.offsetX, ev.offsetY);
    });
    canvas.addEventListener('mousemove', ev => {
        if (ev.which) {
            context.lineTo(ev.offsetX,ev.offsetY);
            context.stroke();
        }
    });
})();
</script>

ぐりぐり書ける。結構いい感じ。今のところ消せないけど。

コードはこんなん。
``` html
<html>
    <canvas width=640 height=480 style="border: 1px solid black;"></canvas>

    <script>
        var canvas = document.querySelector('canvas');
        var context = canvas.getContext('2d');

        canvas.addEventListener('mousedown', function(ev){
            context.beginPath();
            context.moveTo(ev.offsetX, ev.offsetY);
        });

        canvas.addEventListener('mousemove', function(ev){
            if(ev.which){
                context.lineTo(ev.offsetX, ev.offsetY);
                context.stroke();
            }
        });
    </script>
</html>
```
結構短い。

``` javascript
context.strokeStyle = 'red';
```
とか
``` javascript
context.strokeStyle = '#ffffff';
```
とかすると線の色を決められる。

太さは`context.lineWidth`に数値を入れればおっけー。

他にもかなりいろいろあるので調べてみてください。
canvasだけでもうまく使えばゲームとかがりがり作れそうな気がする。

---

余談ですが、
``` javascript
var canvas = document.querySelector('canvas');
```
ってやつはHTML5で追加されたAPIらしいです。
jQueryでの
``` javascript
var canvas = $('canvas')[0];
```
と等価。

``` javascript
document.querySelector('#thisisid');
```
とか
``` javascript
document.querySelector('.classname');
```
とか出来る。便利。

<ins datetime="2023-08-18T22:33">

# 2023-08-18 追記

2023年現在の環境で動くように若干コードを修正しました。

修正前は `ev.layerX` / `ev.layerY` を使用していたものを、 `ev.offsetX` / `ev.offsetY` を使用するように変更してあります。

</ins>
