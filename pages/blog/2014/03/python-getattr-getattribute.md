---
title: pythonには__getattr__の他に__getattribute__なんてものがあるらしい。
pubtime: 2014-03-12T00:57:00+09:00
tags: [Python, メタプログラミング, 言語仕様]
description: pythonがクラスのメンバを取得する流れと、その仮定で使う`__getattr__`と`__getattribute__`の挙動について調べてみました。
---

<ins date="2014-04-23">

# 2014-04-23 追記

[setattrについての記事](/blog/2014/03/python-setattr)もどうぞ。

</ins>

pythonで`test.a`みたいなアクセスの仕方をする時、実は裏側では`__gettattr__(test, 'a')`なんてメソッドが呼ばれてるらしい。
ただのクラスメソッドなので、上書きして自由自在に黒魔術出来ます。楽しいね。

で、気になったのが
``` python
>>> dir(object)
['__class__', '__delattr__', '__doc__', '__format__', '__getattribute__', '__hash__', '__init__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__']
```
`__getattribute__`なんてメソッドがある。なんだこれ。

調べてもよくわからないので、色々実験してみました。
``` python
class tea(object):
    ''' this is document '''

    def __getattribute__(self, name):
        print 'attribute!'
        try:
            return object.__getattribute__(self, name)
        except Exception as e:
            print repr(e)
            raise

    def __getattr__(self, name):
        print 'attr!'
        return 'attr!'

print '--- a ---'
x = repr(tea().a)
print 'return', x
print
print '--- __doc__ ---'
x = repr(tea().__doc__)
print 'return', x
```
こんなスクリプトを書いて実行。

結果は
```
--- a ---
attribute!
AttributeError("'tea' object has no attribute 'a'",)
attr!
return 'attr!'

--- __doc__ ---
attribute!
return ' this is document '
```
こんな感じ。

推測するに、
とりあえず`__getattribute__`を呼んでみて、なんか返ってきたらそのまま返却。**AttributeError**が送出されたら`__getattr__`を探して、見つかったら呼んでみる。
みたいな流れなんじゃないでしょうか。多分。

出来るだけ`__getattr__`を使ったほうが安全そうですね。
