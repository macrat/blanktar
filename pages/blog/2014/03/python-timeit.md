---
title: pythonのベンチマーク用モジュールtimeitの使い方と落とし穴。
pubtime: 2014-03-13T18:40:00+09:00
amp: hybrid
tags: [Python, timeit, ベンチマーク, モジュール]
description: pythonの標準モジュールの一つである「timeit」というベンチマークツールの使い方の紹介です。
---

python標準搭載のベンチマークモジュール、`timeit`。
結構便利なんですよねー、これ。

たとえば、timeモジュールに含まれているsleep関数の実行にどのくらい時間がかかるか知りたいなら
``` python
>>> import timeit
>>> timeit.timeit(stmt='time.sleep(0.1)', setup='import time', number=1)  # 1回だけ実行してみる。
0.09972344867259153
>>> timeit.timeit(stmt='time.sleep(0.1)', setup='import time', number=100)  # 100回実行してみる。
10.05719352328316
```
こんな感じ。

1つ注意しなきゃならないのが、値の大きさ。100回試したら、100回分の時間が返ってきます。

つまり、一回の時間を知りたいなら**試行回数で割らなきゃいけない**。
ということに気付かずにあれーなんか遅いなーなんて試行錯誤してましたとさ。あーあ。

ちなみにコンソールからも使うことが出来て、
``` python
$ python -m timeit -n 1 -r 1 -s "import time" "time.sleep(0.1)"  # 1回
1 loops, best of 1: 101 msec per loop
$ python -m timeit -n 100 -r 1 -s "import time" "time.sleep(0.1)"  # 100回
100 loops, best of 1: 101 msec per loop
$ python -m timeit -n 1 -r 1 -s "import time" "time.sleep(2)"
1 loops, best of 1: 2 sec per loop
```
のようになります。

若干精度が低いけど、まあいいんじゃない？

参考： [良いもの&#12290;悪いもの&#12290;: Python: timeitモジュールを使ってお手軽に実行時間計測](http://handasse.blogspot.com/2013/03/python-timeit.html)
