---
title: ccv.jsを使ってWeb上でリアルタイムな笑い男をやってみた
pubtime: 2016-01-11T00:16:00+09:00
tags: [Web, JavaScript, 画像処理]
image: [/2016/05/laughing-man-eyecatch.png]
description: HTML5のvideoタグとcanvasタグ、ccv.jsというライブラリを使用して、ブラウザだけでカメラ入力を解析、顔認識をさせて笑い男の画像を重ねるプログラムを書いてみました。
---

先程の記事で[HTML5を使った音の解析](/blog/2016/01/html5-audio-context)をやったので、ついでに映像をやってみようかと思いまして。
[pythonでやって](/blog/2015/02/python-opencv-realtime-lauhgingman)好評だった笑い男をやってみました。

とりあえず、必要なライブラリを揃えておきます。といっても[ccv.js](https://github.com/liuliu/ccv/tree/unstable/js)だけで出来ます。
必要なのは[ccv.js](https://github.com/liuliu/ccv/blob/unstable/js/ccv.js)と[face.js](https://github.com/liuliu/ccv/blob/unstable/js/face.js)です。適当にダウンロードします。
あと、当然ながら笑い男も用意します。

で、とりあえず実行例。

<script async src="/blog/2016/01/ccv.js"></script>
<script async src="/blog/2016/01/face.js"></script>

<canvas width="640" height="480" id="laughing_man" style="border: 1px solid black; background-color: white"></canvas>

<button id="laughing_run_button">実行</button>
<button id="laughing_stop_button">停止</button>

<script defer src="/blog/2016/01/html5-realtime-laughing-man.js"></script>

こんなもん。ちょっと、いやすごく重い。

で、ソースコード。

``` html
<script src="ccv.js"></script>
<script src="face.js"></script>

<canvas></canvas>

<script>
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var video = document.createElement('video');
var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

var laughingman = new Image();
laughingman.src = 'laughing.png';

navigator.getUserMedia(
    {video: true},
    function(stream){
        video.src = URL.createObjectURL(stream);

        video.addEventListener('loadedmetadata', function(){
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            (function animation(){
                context.drawImage(video, 0, 0);

                ccv.detect_objects({
                    'canvas': ccv.pre(canvas),
                    'cascade': cascade,
                    'interval': 5,
                    'min_neighbors': 1
                }).forEach(function(x){
                    context.drawImage(laughingman, x.x, x.y, x.width, x.height);
                });

                requestAnimationFrame(animation);
            })();
        });
    },
    console.log
);
</script>
```

実にシンプルです。
`getUserMedia`で映像を取得して、準備が出来たらcanvasのサイズを設定。
映像はcanvasに描画させて、そいつを`ccv.detect_objects`に渡すことで検出を行なっています。
出来ればvideoタグで描画させたかったのだけれど、videoタグを渡して検出させる方法が分からなかったのでcanvasを利用。

**face.js**の中に認識に使うデータが書かれていて、そいつが`cascade`って変数に入るようです。
なのでこいつを別のファイルに差し替えれば顔以外も検出出来るはず。

参考： [WebRTC（２）ccv.jsと組み合わせて顔認識を実装〜笑い男〜 | potter0517](https://potter0517.wordpress.com/2013/03/17/webrtc-2/)
