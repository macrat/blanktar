---
title: gentooのaudacityでピッチを変えたい
pubtime: 2014-12-26T14:12:00+09:00
tags: [Gentoo, 音声処理]
description: gentooにインストールしたaudacityにはデフォルトでは「時間軸のスライド/ピッチの変更」という項目が無いので、USEフラグを変更して使えるようにする方法です。
---

gentooにインストールした**audacity**で曲のピッチ変更をやろうとしたのだけれど、エフェクトのメニューに「時間軸のスライド/ピッチの変更」という項目その物が無い。
その物が無いんじゃやりようがないじゃないか。

どうもコンパイル時のオプションに原因があるようなので、USEフラグをいじり倒してみた。
結論として、`sbsms`とやらを有功にしたら行けた。

ちなみに現時点で私の環境のaudacityは
```
[ebuild   R    ] media-sound/audacity-2.0.2  USE="alsa flac id3tag mp3 sbsms vorbis (-ffmpeg) -jack -ladspa -libsamplerate -midi -soundtouch -twolame -vamp" 0 KiB
```
みたいな感じになってます。

てゆか、調べてみたらsbsmsってのは「For time stretching and pitch scaling of audio.」らしいよ。そのまんま欲しい機能じゃねぇか・・・。

参考： [SBSMS](http://sbsms.sourceforge.net/)
