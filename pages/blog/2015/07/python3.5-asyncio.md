---
title: python3.4/3.5のasyncioが何となく不満。
pubtime: 2015-07-04T01:25:00+09:00
tags: [Python, 言語仕様]
description: Python3.4/3.5から導入されるasyncioライブラリの使い方や挙動を調べてみました。現時点ではまだなんとも不満な感じです。
---

webサーバを書こうとするとIOとか通信とかを非同期実行したくなるのだけれど、pythonには良さげなライブラリが付いてこない。そんなわけで[gevent](http://www.gevent.org/)みたいなサードパーティのライブラリを使うことになります。
・・・と、思ったら。python3.4から**asyncio**というライブラリが付属するようになったらしい。
[ドキュメント](http://docs.python.jp/3/library/asyncio.html)読んでみると「コルーチン、ソケットあるいはその他のリソースを使用した多重I/O」とかそれっぽいことが書いてある。

んで試してみたのだけれど、結構書き方がキモい。python3.5からは少しマシになるようなので、そっちでも試してみました。この記事に記載されているコードはpython3.5向けです。
pythonの安定版の最新バージョンはは3.4.3なので、残念ながらこの記事は未来の記事です。開発版を落として試してみてください。

asyncioで導入された**コルーチン**というやつの正体は、結局のところジェネレータのようです。去年[ジェネレータでグリーンスレッドもどき](/blog/2014/08/yield-green-thread)を作りましたが、あれと思想は似ているみたい。
`@asyncio.coroutine`とかいうデコレータでくるんだコルーチン関数の中で`yield from`構文を使って・・・とか何かそんな感じのがpython3.4時点でのasyncio。

なお、この記事は何となく触ってみただけの記事です。python3.5で追加された構文については [Python3.5から導入されるasyncとawaitでコルーチンを扱う - Qiita](http://qiita.com/Lspeciosum/items/98e05c7495369ab9d102) あたりが参考になるのではないかと思います。

# とりあえず動かしてみる
python3.5のasyncioは以下のような感じになります。
``` python
import random
import asyncio

async def something_hevy():  # コルーチン関数にはdefの前にasyncが付く。
    """ 何だか時間のかかる処理 """

    print('Task start')
    await asyncio.sleep(random.random()*5)  # awaitを頭に付けると、その式は非同期に実行されるらしい。ただし、非同期に実行されるのはasyncなやつだけっぽい。
    print('Task done!')


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    loop.run_until_complete(something_hevy())  # something_hevyが終了するまでイベントループを回す。
```
こんな。
この例だとタスクが一つだけなので、ランダム秒待って終了するだけです。つまらない。

つまらないので、タスクを増やしてみたのがこちら。
``` python
import random
import asyncio

async def something_hevy(id_):
    """ 何だか時間のかかる処理 """

    print('Task {0} start'.format(id_))
    await asyncio.sleep(random.random()*5)
    print('Task {0} done!'.format(id_))


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    tasks = asyncio.wait([something_hevy(i) for i in range(5)])  # 実行すべきタスクのリストをasyncio.waitに渡すと、すべてが終了するまで待ってくれるコルーチンが出来る。
    loop.run_until_complete(tasks)  # 作ったコルーチンが終了するまでイベントルーチンを回す。
```
タスクが5つに増えました。

実行するとこんな感じ。
```
Task 2 start
Task 3 start
Task 1 start
Task 0 start
Task 4 start
Task 0 done!
Task 2 done!
Task 4 done!
Task 3 done!
Task 1 done!
```
表示される順番はランダムです。startは一斉に表示されて、doneは三々五々、って感じ。

`await asyncio.sleep`の部分を`time.sleep`とかに置き換えるとstartが一斉に表示されなくなります。
await付けようが普通の関数は非同期実行出来ないっぽい？

# ソケットと合わせて使ってみる
1秒おきに時間を表示しつつエコーサーバならぬエコークライアントの機能を果たす、的なコードを書いてみました。
``` python
import datetime
import asyncio

async def echo():
    """ エコーサーバ、じゃなくてエコークライアント """

    print('connect...', end='')
    reader, writer = await asyncio.open_connection('localhost', 4321)  # TCPで接続して、StreamReader,StreamWriterとやらを返す関数。
    print('done')

    while not reader.at_eof():
        print('read... ', end='')
        recv = await reader.readline()
        print(recv)

        print('send...', end='')
        writer.write(recv)
        await writer.drain()  # flush的なものらしい？ こいつを呼んでawaitしてやらないとブロックしてしまって並列実行にならない。
        print('done')

async def clock():
    """ 毎秒時間を表示するだけ。 """

    while True:
        print(datetime.datetime.now().isoformat())
        await asyncio.sleep(1)


if __name__ == '__main__':
    loop = asyncio.get_event_loop()
    asyncio.ensure_future(clock())  # clockの実行を予約（？）する。until_completeでもwaitでもないのでループが終了したら勝手に死ぬ？
    loop.run_until_complete(echo())
```
何だか荒っぽいコードですが、何となく動きます。

しかし何でファイルライクオブジェクトでなくリーダーとライターなんでしょうね？ どことなくJavaっぽくない？
通信プロトコルを抽象化するための[プロトコルクラス](http://docs.python.jp/3/library/asyncio-protocol.html#protocols)なんてものがあるので、そちらを使うべきなのかもしれません。

---

うーん、何というか、今までのpythonコードとの互換性が結構薄い感じ？
単純に`def`を`async def`に書き換えただけじゃ何の意味もなさそうだし。

[公式のドキュメント](http://docs.python.jp/3/library/asyncio.html)を見てみると分かるのですが、asyncioパッケージだけでもかなり多岐に渡る機能を持っています。ロックとセマフォとか、threadingのやつとかぶってんじゃんって感じ。
関数にはデコレータを使うとか、async用のopen関数とかsocketを用意するとかして互換性を保った実装は出来んかったんだろうかと思ったりします。

まあ、こんな感じであることにはきちんと意味があるんだろうけれどさ。
何にせよ難しいよ、asyncio。
