---
title: python3.6のPEP526で導入される変数アノテーションの話
pubtime: 2016-09-22T22:30:00+09:00
tags: [Python, 言語仕様]
description: Python3.6で新たに導入される変数アノテーションという機能について調べた記録です。構文や挙動、定義上の意味などについて記載しています。
---

[PyCon JP 2016](https://pycon.jp/2016/)に行ってきました。楽しかったです。そんなことはどうでもいいです。いやどうでもよくないですが。
色々なお話を聞いていたら、PEPを読みたくなりました。読みました。

Python3.6から、関数アノテーションに引き続いて（？）変数アノテーション（Variable Annotations）なるものが導入されるようです。
[PEP526](https://www.python.org/dev/peps/pep-0526/)に詳細に書いてあるので、そちらを読んでいただけると宜しいかと思います。
この記事では大雑把に変数アノテーションとは何ぞやというお話を。

# 何が新しいのか
従来の型ヒント（[PEP484](https://www.python.org/dev/peps/pep-0484)あたり）では、変数に対するアノテーションはコメントの形を取って行なわれていました。
``` python
x = 10  # type: int
ys = [1, 2, 3]  # type: Iterable[int]
```
こんな感じ。

構文を追加しなくて良いから素敵ってことらしいんですが、なんか、ダサい。

同じ意味のことを、PEP526の変数アノテーションを使うと以下のように書けます。
``` python
x: int = 10
ys: Iterable[int] = [1, 2, 3]
```
かっこいい。

しかもこの構文だと、アノテーションだけ書いて値を定義しない、みたいなことが出来ます。
``` python
x: int
ys: Iterable[int]

x = 10
ys = [1, 2, 3]
```
アノテーションと代入を分けてみた感じ。
静的に変数を定義して使っているように見えますね。

分離して書けるようになったことで、if文で場合分けしたりして書くような場合にシンプルに記述出来るようになりました。
``` python
if check_A():
    a = get_A()  # type: int
else:
    a = 0  # type: int

b: int
if check_B():
    b = get_B()
else:
    b = 0
```

# アノテーションを書くということの意味
関数アノテーションを書くと、関数のメンバ変数`__annotations__`というものの中にアノテーションの内容が保存されます。
``` python
>>> def f(x: int) -> str:
...     return 'hoge' * x
...
>>> f.__annotations__
{'x': &lt; 'int'>, 'return': <class 'str'>}
```
こんな感じでアクセス出来ます。lintはこの情報にアクセスしているわけですね。

変数アノテーションの場合はどうなるかというと、そのまんま`__annotations__`というものの中に入ります。
この変数は名前空間毎（というよりモジュール毎？）に用意されます。
``` python
>>> x: int = 0
>>> __annotations__
{'x': <class 'int'>}

>>> y: str
>>> __annotations__
{'x': <class 'int'>, 'y': <class 'str'>}
```
なんとこの変数は普通に書き換え可能ですが、書き換えない方が良いような気がします。

関数アノテーションと同じく、変数アノテーションに記述する内容は何でも良いようです。
PEP526には以下のような例が載っています。（ちょっと変えてます）
``` python
>>> alice: 'well done' = 'A+'
>>> bob: 'what a shame' = 'F-'
>>> __annotations__
{'alice': 'well done', 'bob': 'what a shame'}
```
奇妙なことになっている気がしますが、まあこれはこれでアリらしいです。
なるべく型ヒントに使うことをお勧めするよ、みたいなことが書かれています。

# アノテーションを書くと起こること
上記の通り、アノテーションの内容は`__annotations__`という名前のdictに入る、というのが変数アノテーションの趣旨でした。
というより、それ以上のことは何もしてくれない、というのが正しいようです。

``` python
>>> x: int
>>> x
Traceback (most recent call last):
  ...
NameError: name 'x' is not defined
>>> __annotations__
{'x': <class 'int'>}

```
変数アノテーションを書くと、`__annotations__`にアノテーションの内容が保存されます。
しかし、変数の宣言とか確保とかいう意味合いは全く無いので変数にアクセスすることは出来ません。

``` python
>>> x: int
{'x': <class 'int'>}

>>> x: str
>>> __annotations__
{'x': <class 'str'>}
```
アノテーションの内容は（文法上は）何の問題も無く上書きすることが出来ます。
エラーチェッカの挙動については「Static type checker may or may not warn about this.」らしいです。PEPとしては関与しませんよって感じ？
型ヒントの意味を考えると、やめておいた方が無難だと思います。

``` python
>>> __annotations__ = None
>>> x: int
Traceback (most recent call last):
  ...
TypeError: 'NoneType' object does not support item assignment
```
`__annotations__`変数に内容を入れる（`__setitem__`を呼ぶ）、というだけの挙動なので、そもそも入れられない型で上書きされてしまっているとエラーが発生します。

この性質を逆用して、以下のようにフックすることも可能です。
``` python
>>> class Test:
...     def __setitem__(self, k, v):
...         print('annotation:', k, v)
...
>>> __annotations__ == Test()
>>> a: int
annotation: a <class 'int'>
```

# クラス変数とインスタンス変数
`typing`モジュールに`ClassVar`なるものが追加されています。
これを使って、クラス変数とインスタンス変数を区別してヒンティング出来るらしいです。

``` python
import typing

class Greeter:
    greet: typing.ClassVar[str]
    name: str

    def __init__(self, name: str) -> None:
        self.name = name

    def say(self -> None:
        print(f'{self.greet} {self.name}')

if __name__ == '__main__':
    g = Greeter('world')
    g.greet = 'hello'
    g.say()
```
こんな感じで良い、らしいです。らしいのですが、mypyのリポジトリにまだプルリクがマージされてなかったりしてよく分かりません。試せません。
わくわくしながら待ちましょう。

# 結局変数アノテーションとは何なのか
全体として見てみると、あまり今まで定義されてきたアノテーションとあまり変らない感じです。
変数にアノテーションを付ける専用の構文が出来たことで見やすく書きやすくなった、ということみたい。

アノテーションや型ヒントを付けたところでやっぱり実行速度に影響することは無いし、やっぱり動的型付け言語のままらしいです。
漸進的型付けが本当に活きてくるのはもうちょっと周辺のツール群が充実してからかなぁ…。
