---
title: HTML5でマイクで拾った音を色々して何か作った。
pubtime: 2016-01-10T22:13:00+09:00
tags: [HTML5, JavaScript, 音声処理, Canvas]
description: HTML5のaudioタグとcanvasタグ、それからAnalyserNode APIを使って、録音やマイク入力をブラウザだけで解析・可視化してみました。色々と面白いことが出来そうです。
---

なんか面白いものを作ろうかと思って、HTML5の[AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode)とやらを使ってみました。
細かいことはともかくとして、大雑把に使い方を。

なんかこんな感じのやつが出来る。マイクの付いた新しめのブラウザでご覧下さい。

<canvas style="border: 1px solid black; background-color: white" width="640" height="480" id="mic_frequency_one"></canvas>

ソースコードはこんな感じです。
``` html
<audio muted></audio>
<canvas width=640 height=480></canvas>
<script>
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var canvas = document.querySelector('canvas');
var context = canvas.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

navigator.getUserMedia(
    {audio : true},
    function(stream){
        document.querySelector('audio').src = URL.createObjectURL(stream);
        var audioContext = new AudioContext();
        var analyser = audioContext.createAnalyser();
        var timeDomain = new Float32Array(analyser.frequencyBinCount);
        var frequency = new Uint8Array(analyser.frequencyBinCount);
        audioContext.createMediaStreamSource(stream).connect(analyser);

        (function animation(){
            analyser.getFloatTimeDomainData(timeDomain);
            analyser.getByteFrequencyData(frequency);

            context.clearRect(0, 0, canvas.width, canvas.height);

            context.strokeStyle = 'blue';
            context.beginPath();
            context.moveTo(0, canvas.height - frequency[0]*canvas.height/255);
            for(var i=0; i<frequency.length; i++){
                context.lineTo(
                    i*canvas.width/frequency.length,
                    canvas.height - Math.max(0, frequency[i]*canvas.height/255)
                );
            }
            context.stroke();

            context.strokeStyle = 'red';
            context.beginPath();
            context.moveTo(0, canvas.height/2 + timeDomain[0]*canvas.height/2);
            for(var i=0; i<timeDomain.length; i++){
                context.lineTo(
                    i*canvas.width/timeDomain.length,
                    canvas.height/2 + timeDomain[i]*canvas.height/2
                );
            }
            context.stroke();

            requestAnimationFrame(animation);
        })();

    },
    console.log
);
</script>
```
配列と[AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)とやらを作って、[AnalyzerNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode)を[AudioNode](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode)に接続。
あとは`getFloatTimeDomainData`ってやつで波形、`getByteFrequencyData`ってやつで周波数（波形をフーリエ変換したやつ）を取得出来ます。
どちらも`getFloat`を使うと浮動小数点で、`getByte`から始まるやつを使うと0から255までの値で取得出来ます。分かりやすくて良いね。

マイクからリアルタイムに音を取得したい場合は`createMediaStreamSource`の代わりに`createMediaElementSource`を使います。大体こんな感じ。
``` html
<audio src="music.mp3" controls></audio>
<script>
    var audioContext = new AudioContext();
    var analyser = audioContext.createAnalyser();
    audioContext.createMediaElementSource(document.querySelector('audio')).connect(analyser);
</script>
```
それ以外の使い方は一緒です。getUserMediaとかやらなくて良いだけもっとシンプル。

普通にcanvasを使っているので、わりと何でも出来ます。楽しい。

<canvas style="border: 1px solid black" width="640" height="480" id="mic_frequency_two"></canvas>

余談ですが、google chromeでgetUserMediaを使おうとする場合はhttpsを使わないといけないようです。Firefoxとかは分からん。
そんなわけでこのページもHTTPSになってるはず。

<audio muted></audio>
<script defer sec="/blog/2016/01/html5-audio-context.js"></script>
