---
title: python3.2以降のlru_cacheが素敵すぎて。
pubtime: 2014-03-17T01:07:00+09:00
amp: hybrid
tags: [Python, Python3, lru_cache, functools, LRU, キャッシュ, モジュール]
description: python3.2からfunctoolsモジュールに追加された「lru_cache」というデコレータを使って、関数の引数と戻り値のペアをキャッシュする方法です。
---

python3.2から**functools**モジュールに`lru_cache`なんてデコレータが追加されてます。
その名の通り、関数の戻り値をLRU方式でキャッシュしてくれる。

例によって使い方はとっても簡単。
``` python
>>> @functools.lru_cache()
... def test(x):
... 	return x**2
```
これだけ。

機能しているかを知りたいときは
``` python
>>> test.cache_info()
CacheInfo(hits=0, misses=0, maxsize=128, currsize=0)
>>> test(2)
4
>>> test(3)
9
>>> test.cache_info()
CacheInfo(hits=0, misses=2, maxsize=128, currsize=2)
>>> test(2)
4
>>> test.cache_info()
CacheInfo(hits=1, misses=2, maxsize=128, currsize=2)
```
こんな感じで情報を得ることが出来ます。

キャッシュ出来る量（maxsize）は
``` python
>>> @functools.lru_cache(maxsize=255)
... def test(x):
... 	return x**2
>>> test.cache_info()
CacheInfo(hits=0, misses=0, maxsize=255, currsize=0)
```
`maxsize`って引数で。

Noneを渡せば無限にキャッシュ出来るようです。

たった一行追加するだけでキャッシュできるようになるのだから凄いよね。
この機能のためだけに3.xに移行する価値があるような気がする。

どーしてもpython2.7でやらなきゃならんなら[python-functools32](https://github.com/MiCHiLU/python-functools32)なんてのがあるようですので最後の手段として？

ちなみにキャッシュの管理はdict型でやってるっぽい？ なので、引数はdictにkeyとして渡せる値である必要があります。
listとか渡すと怒られちゃうので注意。

参考： [10.2. functools &mdash; 高階関数と呼び出し可能オブジェクトの操作 &mdash; Python 3.3.3 ドキュメント](http://docs.python.jp/3.3/library/functools.html)
