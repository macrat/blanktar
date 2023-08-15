---
title: jQueryでタッチパネルを扱う
pubtime: 2014-06-26T17:49:00+09:00
modtime: 2014-06-26T19:59:00+09:00
amp: hybrid
tags: [jQuery, タッチパネル, JavaScript]
description: jQueryでタッチパネルへのタッチイベントを取得して、アニメーションするものを作ってみました。同時タッチ数制限とか無くいくらでも取得出来るようです。
---

友人のノートPCのタッチパネルが羨ましすぎたので[タッチイベントで遊んで](/blog/2014/06/popcircle)みました。
開くと真っ白いだけのなんもない画面が出ます。
その上でマウスを動かすか、タッチすると円がぷわーってこう、こう、まあともかく実物見て。

流石jQuery・・・だからなのかjavascriptのおかげなのかは分からないけれど、同時タッチ数に制限はない（はず）。

使い方は結構簡単で、
``` javascript
$('#target').bind('touchstart', function(){
    event.preventDefault();  // ページが動いちゃったりズームしちゃったりを止めるらしい。右クリックも効かなくなるっぽいので注意。
    for(var i=0; i&lt;event.changedTouches.length; i++){
        event.changedTouches[i].pageX  // X座標
        event.changedTouches[i].pageY  // Y座標
    }
});
```
みたいな感じ。
`touchstart`の部分を`touchmove`にしてやると、タッチしたまま動かしたときになります。
タッチ終了したときのイベントは`touchend`。終了地点の座標は取れないらしい。

参考: [iPhone/Android/PC 対応。jQuery で書くタッチイベント (フェンリル | デベロッパーズブログ)](http://blog.fenrir-inc.com/jp/2011/06/ios_android_pc_touchevent.html)

<PS date="2014-06-26T18:55:00+09:00" level={1}>

どうやら、firefox（つまりgecko？）ではeventは引数として渡されるみたいです。

なので、ソースは

``` javascript
$('#target').bind('touchstart', function(event){
```

みたいな感じに修正が必要。

どっちにも対応するなら

``` javascript
$('#target').bind('touchstart', function(e){
```

としておいて、

``` javascript
if(typeof(event) == 'undefined'){
    event = e;
}
```

のような感じで対応するといいかも。

</PS>

<PS date="2014-06-26T19:59:00+09:00" level={1}>

jQueryを使用してイベントハンドラを登録した場合、

``` javascript
event.originalEvent.changedTouches
```

のようにして取得しなきゃいけないようです。
jQueryと銘打っちゃったけど、実はきちんと対応されてないのか・・・？

参考: [iPhone/SafariでjQueryを使ったイベントのバインドにおける注意点 : nogunogu](http://dev.worksap.co.jp/Members/nogunogu/2010/08/17/iphonesafari%E3%81%A7jquery%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E3%82%A4%E3%83%99%E3%83%B3%E3%83%88%E3%81%AE%E3%83%90%E3%82%A4%E3%83%B3%E3%83%89%E3%81%AB%E3%81%8A%E3%81%91%E3%82%8B%E6%B3%A8%E6%84%8F/)

</PS>
