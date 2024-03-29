---
title: python3.6で導入されるf文字列はformatメソッドとは違う
pubtime: 2016-02-07T23:48:00+09:00
tags: [Python, 言語仕様]
description: Python3.6で新たに導入されるf文字列というやつを調べてみると、どうやら今までのformatメソッドとは似て非なるもののようでした。その違いについて調べた記録です。
---

pythonで文字列フォーマットをするときには今のところ二通り方法があって、pythonには珍しく(？)統一されていない感じになっています。
で、python3.6では更に新しい方法が追加されるらしいです。
軽く使ってみたのですが、微妙にformatメソッドと違ったりして不思議な感じなので、軽くメモ。
記事執筆時点での開発版の仕様を元にしているので、もしかしたら正式版とは違うかもしれません。注意です。

とりあえず既存の一つめの方法。%式。式？ 演算子？
``` python
>>> w = 'world'
>>> 'hello %s' % w
'hello world'
```
こんなやつ。わりとよく見掛けるやつです。
フォーマット文字列の文法はなんとなくC言語とかのprintfに似てますね。

で、二つめの方法はformatメソッド。
``` python
>>> w = 'world'
>>> 'hello {0}'.format(w)
'hello world'
```
こんなん。ちょっとモダンです。かなり高機能で、色々出来る。
一応これが推奨の方法らしいですが、bytesにも%でフォーマットする方法が導入されたりして、なんだかよくわからない。

そして、新しく導入されるのがf文字列ってやつ。
``` python
>>> w = 'world'
>>> f'hello {w}'
'hello world'
```
シンプルっぽい。
ご覧の通り、というか何というか、変数名をそのまま使えるようになっています。

で、こいつ。formatメソッドと同じような構文で、同じことが出来るように見えます。
``` python
>>> n = 12
>>> f'{n:05d}'
'00012'

>>> s = 'hello'
>>> f'{s: <7s}'
'hello'
```
ゼロ詰めとか、右寄せとか左寄せとか。

なんだー簡単じゃんと思うわけですが、微妙に仕様が違うようです。
どうも、変数名のところに普通のリテラルも書けるようです。
つまりどういうことかというと、普通の計算式を書ける。
``` python
>>> f'{12 + 34}'
'46'

>>> n = 1
>>> f'{n * 2}'
'2'

>>> a = 'hello'
>>> b = 'world'
>>> f'{a + " " + b}'
'hello world'

>>> def func(x):
...     return x * 2
... 
>>> f'{func(2)}'
'4'
```
おお、よくわからなくなってきた。

formatメソッドのときはどうだったかというと、計算しようとするとKeyErrorが出たりします。
``` python
>>> '{12 + 34}'.format()
Traceback (most recent call last):
 File "<stdin>", line 1, in <module>
KeyError: '12 + 34'
```
うん、分かりやすい反応

それでも概ね使い方に違いは無さそうですが、とりあえず違いが影響しそうなのはdict型にアクセスするときとか。
``` python
>>> d = {'a': 1, 'b': 2}

>>> '{0[a]}'.format(d)
'1'
>>> '{d[b]}'.format(d=d)
'2'
>>> '{0["a"]}'.format(d)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
KeyError: '"a"'

>>> f'{d["a"]}'
'1'
>>> key = 'b'
>>> f'{d[key]}'
'2'
>>> f'{d[a]}'
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
NameError: name 'a' is not defined
```
こんなん。
普通の値か、それとも専用のミニ言語か、というような感じの違いなんでしょうね、きっと。
考えてみりゃ当然のことですが、ちょっとふしぎ。

文字列の定義と同時にしか使えない（多分）し、使えたとしてもセキュアじゃない感じがするし、既存の方法の置き換えというわけにはいかなそうです。
状況に応じて色々組み合せる必要性がありそう。うーむ。

参考： [Pythonの新しい文字列フォーマット : %記号、str.format()から文字列補間へ | プログラミング | POSTD](http://postd.cc/new-string-formatting-in-python/)
