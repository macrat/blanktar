---
title: pythonでビープ音を鳴らし、あまつさえ演奏する。
pubtime: 2013-08-26T23:12:00+09:00
modtime: 2015-07-01T00:00:00+09:00
tags: [Windows, Python, ハードウェア]
description: Pythonを使って、windows環境で自由な音程・長さのビープ音を鳴らして音楽を演奏するプログラムを作ってみました。
---

<ins date="2015-07-01">

# 2015-07-01 追記

[C言語でほぼ同じ事をした記事](/blog/2013/09/c-language-beep)もあります。

</ins>

pythonには**winsound**というのがあって、wav再生したりエラー音再生したりビープ音鳴らしたり出来るらしい。
そう、ビープ音を鳴らせる！　これは楽しい！
ってことで、ちょっと遊んでみた。

``` python
>>> import winsound
>>> winsound.Beep(523, 500)
```
てやると、523Hz(ド)の音が500ミリ秒鳴る。
37Hzから32,767Hzまで対応とのことで、結構幅広め。

で、こいつを使って演奏してみた・・・っていうか、演奏できるようにしてみた。
``` python
#coding:utf-8
#
#		ビープ音で演奏するやつ。
#
#	周波数の参考: http://asrite.blog.fc2.com/blog-entry-229.html
#
#						MIT License (c)2013 MacRat

from winsound import Beep
from time import sleep

BASE = 500

sound = tuple(sorted((
    (u'ド', 523),
    (u'レ', 587),
    (u'ミ', 659),
    (u'ファ', 698),
    (u'ソ', 784),
    (u'ラ', 880),
    (u'シ', 932),
), key=lambda x: len(x[0]), reverse=True))

def Play(l):
    while l:
        for name, key in sound:
            if l.startswith(' '):
                l = l[1:]
                print
                sleep(BASE/1000.0)
            if l.startswith(name):
                l = l[len(name):]

                time = 1
                while l.startswith(u'ー'):
                    l = l[1:]
                    time += 1

                print name + u'ー'*(time-1)
                Beep(key, BASE*time)
                break
        else:
            l = l[1:]

if __name__ == '__main__':
    #Play(u'ドレミファソラシ')
    Play(u'ドレミーレド ドレミレドレー')
```
[ダウンロード（右クリックで保存）](/blog/2013/08/beep.py)

ご覧のとおり、ドレミで入力したものを演奏してくれます。
今のところド-シまでの対応だけれど、soundに周波数の情報を追加すれば一オクターブ上も下も鳴らせる。

面白い、けど、意味ないなぁこれ・・・。
