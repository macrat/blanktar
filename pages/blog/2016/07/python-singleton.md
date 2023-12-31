---
title: pythonで良い感じのシングルトンを書く
pubtime: 2016-07-24T18:18:00+09:00
tags: [Python, 言語仕様]
description: Pythonでシングルトンのクラスをスマートに作る方法です。__new__というメソッドを使用することで、通常のクラスと同じようなインターフェースで使えるようにしています。
image: [/blog/2016/07/python-singleton.png]
---

pythonでシングルトンを書くと結構スマートに書けるっぽいことを知ったのでメモ。
まあ、私は滅多にシングルトン使わないんですけれど。

シングルトンっていうのは以下のようなやつです。
``` python
class NormalSingleton:
    _instance = None

    def __init__(self):
        print('init')

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()

        return cls._instance


if __name__ == '__main__':
    a = NormalSingleton.get_instance()  # initが表示される
    b = NormalSingleton.get_instance()  # 何も表示されない
    print(a is b)  # True

    c = NormalSingleton()  # init
    b = NormalSingleton()  # init
    print(a is b)  # False
```
こいつはよくある普通の実装。
`get_instance`メソッドを使ってインスタンスを取得しているうちは良いのですが、普通にインスタンス化出来てしまうのでシングルトンになりません。
他の言語だとコンストラクタをプライベートにするとかで対処するわけですが、pythonではそうも行かず。

で、どうするかっていうと、`__new__`ってメソッドを定義することにします。
`__new__`っていうのはクラスのインスタンスを作るときに呼ばれる特殊なメソッドで、`__init__`の前に呼ばれるようになっています。
こいつを使うとめっちゃ良い感じになる。

``` python
class SimpleSingleton:
    _instance = None

    def __init__(self):
        print('init')

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)

        return cls._instance


if __name__ == '__main__':
    a = SimpleSingleton()  # initが表示される
    b = SimpleSingleton()  # こっちもinitが表示される
    print(a is b)  # True
```
使い方がとてもシンプルになりました。シングルトンかそうでないかを利用者が気にする必要性が無くなってハッピー。

`__init__`が二回呼ばれるようになることだけ注意です。
初期化は`__new__`の中でやっても良いかもね？

ちなみにどちらの実装もスレッドセーフではないので、スレッドセーフにしたい場合はLockを導入しましょう。
導入すると以下のような感じ。
``` python
import threading


class ThreadingSingleton:
    _instance = None
    _lock = threading.Lock()

    def __init__(self):
        print('init')

    def __new__(cls):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)

        return cls._instance
```
使い方は全く変わらないので省略。
めっちゃ単純で良い感じですね。
