---
title: pythonでクラスメソッドを使ってみる
pubtime: 2014-12-02T16:26:00+09:00
amp: hybrid
tags: [Python, クラスメソッド, 言語仕様]
description: C++やJavaではわりとよく使われるクラスメソッドですが、Pythonでも使うことが出来ます。というわけで、Pythonのクラスメソッドの使い方の解説記事です。
---

C++やJavaなんかにあるクラスメソッド。実はpythonでも使えるそうな。
あんまり使いそうな気がしないけれど、とりあえず試してみました。

``` python
class Test(object):
    count = 0

    def __init__(self):
        self.__addCount()

    @classmethod
    def __addCount(cls):
        cls.count += 1

    @classmethod
    def getCount(cls):
        return cls.count

print Test.getCount()	# 0
Test()	# 1回目のインスタンス化
print Test.getCount()	# 1
Test()	# 1回目のインスタンス化
print Test.getCount()	# 2
```
インスタンス化された回数を数えてくれる。

注意が必要なのは、
``` python
def __init__(self):
    self.count += 1
```
みたいにしてはいけないということ。

こうするとインスタンス変数としてcountが作られちゃいます。値は1ね。
クラス変数の方を変えてよってことでクラスメソッドの`__addCount`を作って使っているわけです。

クラスメソッドの宣言は`@classmethod`ってデコレータを使えばおっけー。
**第一引数にクラスが渡される**ことに注意。インスタンスメソッドのselfみたいなもんだね。

---

綺麗に設計すればオブジェクト指向は便利なんだろうけれど・・・綺麗に・・・うぅむ。

参考: [Python のクラスメソッド &#8211; デコレータ @classmethod, @staticmethod を使って | すぐに忘れる脳みそのためのメモ](http://jutememo.blogspot.jp/2008/09/python-classmethod-staticmethod.html)
