---
title: pythonでinotifyを使ってみる。
pubtime: 2013-03-22T01:47:00+09:00
modtime: 2013-09-07T00:00:00+09:00
tags: [Linux, Python, ライブラリの紹介]
description: linuxのinotifyを使って、ファイルシステムの変更を監視するプログラムをPythonで作ってみました。
---

inotifyっての、ご存知でしょうか。
linux karnelの機能で、変更されたファイルを通知してくれるシステム。
なんだかよく分からないけれど、なんだか楽しそうな気がしたので、触ってみました。

<ins date="2013-09-07">

# 2013-09-07 追記

wm.rm_watchとしなければならないところをwm.rem_watchとしてしまっていたのを修正。
申し訳ない

</ins>
<ins date="2015-07-01">

# 2015-07-01 追記

[シェルからinotifyを利用する方法](/blog/2015/06/watch-file-modify)も書きました。
手軽に確認したいだけとかならシェルのがいいかも。

</ins>

# インストール
[pyinotify](https://github.com/seb-m/pyinotify/wiki)ってライブラリを使ってみます。
portageにあったので、今回はそれを使用。

``` shell
$ sudo emerge dev-python/pyinotify
```
これだけ。
他のOSなんかを使ってる方は、[githubにあるやつ](https://github.com/seb-m/pyinotify)をどうぞ。

# とりあえず使う
``` python
import time
	
import pyinotify


class Handler(pyinotify.ProcessEvent):
	# イベント通知を受け取るモノ。
	# process_フラグ名(self, event)　って関数を用意しておけばいいみたいね。

	def process_IN_CREATE(self, event):
		# ファイルやディレクトリが追加された時に呼ばれる

		print 'Create :'
		print event

	def process_IN_DELETE(self, event):
		# ファイルやディレクトリが削除された時に呼ばれる

		print 'Delete :'
		print event

	def process_default(self, event):
		# それ以外の場合に呼ばれる

		print event.maskname
		print event


wm = pyinotify.WatchManager()

# 監視スレッドを作って、走らせる。
#  Handler()の()に注意。インスタンスを渡します。
notifier = pyinotify.ThreadedNotifier(wm, Handler())
notifier.start()

# 監視するイベントの種類
#  フラグの意味は後述する表を参照。
mask = pyinotify.IN_CREATE | pyinotify.IN_DELETE | pyinotify.IN_MODIFY

# 監視対象の追加
wdd = wm.add_watch('/tmp', mask)

time.sleep(30)

# 監視対象の削除
#  `wdd['/tmp']`みたいにすれば特定のディレクトリだけ削除できる。
#  ちなみに、python3.xの場合は`list(wdd.values())`としなければいけないみたい。
wm.rm_watch(wdd.values())

# 監視スレッドの終了
#  これを忘れるとプログラムが終了しません。
#  そのまえで例外で終了しちゃったりすると、killするしかなくなるみたい。
notifier.stop()
```
こんな感じ。ほぼ[sourceforge](http://pyinotify.sourceforge.net/#Brief_Tutorial)のマネ。
30秒間だけ/tmpの変更（ファイルの追加と削除）を監視します。

# フラグ一覧
## 通知関連

|名称            |発生するタイミング                                      |
|----------------|--------------------------------------------------------|
|IN_ACCESS       |ファイルアクセスがあった時                              |
|IN_ATTRIB       |メタデータに変更があった時                              |
|IN_CLOSE_WRITE  |書き込み用に開かれたファイルが閉じられた時              |
|IN_CLOSE_NOWRITE|書き込み以外のために開かれたファイルが閉じられた時      |
|IN_CREATE       |ファイルやディレクトリが作られた時                      |
|IN_DELETE       |ファイルやディレクトリが消された時                      |
|IN_DELETE_SELF  |監視しているファイルやディレクトリそのものが消された時  |
|IN_MODIFY       |ファイル内容が変更された時                              |
|IN_MOVE_SELF    |監視しているファイルやディレクトリそのものが移動された時|
|IN_MOVED_FROM   |ファイルやディレクトリがどこかから移動されてきた時      |
|IN_MOVED_TO     |ファイルやディレクトリがどこかに移動された時            |
|IN_OPEN         |ファイルが開かれた時                                    |
|IN_Q_OVERFLOW   |イベントキューがオーバーフローを起こした時              |
|IN_UNMOUNT      |監視しているファイルやディレクトリを含むファイルシステムがアンマウントされた時|

## その他

|名称          |内容                                                                                                                |
|--------------|--------------------------------------------------------------------------------------------------------------------|
|IN_DONT_FOLLOW|シンボリックリンクを辿らない（Linux Kernel 2.6.15以降）                                                             |
|IN_ISDIR      |ディレクトリに対して設定する・・・？                                                                                |
|IN_MASK_ADD   |既に設定されているディレクトリに対して二重に設定した場合、上書きではなく追加として設定する (Linux Kernel 2.6.14以降)|
|IN_ONLYDIR    |与えられた引数がディレクトリの場合のみ監視する（Linux Kernel 2.6.15以降）                                           |

---

参考：
- [pyinotify - github](https://github.com/seb-m/pyinotify/wiki)
- [pyinotify - sourceforge](http://pyinotify.sourceforge.net/)
- [Man page of INOTIFY](http://linuxjm.sourceforge.jp/html/LDP_man-pages/man7/inotify.7.html)
