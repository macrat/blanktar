---
title: pythonのyieldでグリーンスレッド（笑）
pubtime: 2014-08-03T00:24:00+09:00
tags: [Python]
description: pythonのyieldを使って、ものすごく簡易的なグリーンスレッドっぽいものを実装してみました。
---

コルーチンとやらを使ってみたいのだけれど使い所がいまいちわからないので、yield使ってグリーンスレッド的なものを作ってみた。

あくまで（笑）なので実用性は不明です。かなり適当な実装です。
分岐多いから速度遅そうな気がする。なんとなく。

スケジューラ本体は
``` python
def scheduler(tasks):
    while True:
        nx = []
        for task in tasks:
            try:
                ret = next(task)
            except StopIteration:
                continue

            if ret == True:
                nx.append(task)
            elif isinstance(ret, tuple):
                if ret[0] == True:
                    nx.append(task)
                nx.extend(ret[1:])
        if nx:
            tasks = tuple(nx)
        else:
            break
```
こんな感じ。割と簡単。

使い方としては
``` python
def alice():
    print 'A: 1'
    yield True
    print 'A: 2'

def bob():
    print 'B: 1'
    yield True
    print 'B: 2'

scheduler((alice(), bob()))
```
みたいな感じ。

出力は
```
A: 1
B: 1
A: 2
B: 2
```
のようになります。

一応スレッドっぽく扱えるはず。

スレッドは後から追加可能で、
``` python
def alice():
    print 'alice'
    yield True, bob()
    print 'alice2'

def bob():
    print 'bob'
    yield True
    print 'bob2'
```
のようにすると
```
alice
alice2
bob
bob2
```
と出力されます。あとからタスクを追加、的な。
カンマ区切りでいくらでも書けるはず。

yieldで返しているTrueをFalseに変更すれば次の周回からは呼ばれなくなります。
他のスレッドに制御を渡したくない関数なんかだとreturnの代わりにyield Falseかなんかを書かなきゃならなかったりしてちょっと面倒かも。

ま、実験だからなんでもいいでしょう。
わりと簡単に面白いものを作れるようだけれど、なんでそこでyieldなんだっていう訳の分からんさはあるかも知れない。
