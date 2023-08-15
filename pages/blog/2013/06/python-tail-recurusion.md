---
title: Pythonで末尾再帰する
pubtime: 2013-06-08T19:16:00+09:00
amp: hybrid
tags: [Python, 末尾再帰, メタプログラミング]
description: Pythonのデコレータを使って、末尾再帰最適化を実現する方法です。速くはならないけれど、少なくともどれだけループさせてもメモリが枯渇して停止することは無くなります。
---

再帰っていいよね。なんか楽だ。

楽なんだけど、メモリとか時間とか食うのよね。
そこで末尾再帰・・・なんだけど、末尾再帰で書いても最適化されないんだよね、python。

それならば、と最適化するのをデコレータで実装しちゃった人が居るらしい。
メタプログラミングってやつだね。すごい。

[New Tail Recursion Decorator (Python recipe) - ActiveState Code](http://code.activestate.com/recipes/496691/)<br />
[Pythonのクロージャで末尾再帰最適化をする。 - tanihitoの日記](http://d.hatena.ne.jp/tanihito/20110119/1295459297)

だんだん綺麗になってくのがいいっすね、素敵。

でもさ、まだ行けると思うんだ。
という訳で、更に手を入れてみました。
``` python
def tail_recursive(func):
	from functools import wraps

	@wraps(func)
	def _tail(*args, **kwd):
		_tail.__args = args
		_tail.__kwd = kwd

		if _tail.__firstcall:
			_tail.__firstcall = False

			result = func
			try:
				while result is func:
					result = func(*_tail.__args, **_tail.__kwd)
			finally:
				_tail.__firstcall = True

			return result
		else:
			return func
	_tail.__firstcall = True

	return _tail
```
関数のメンバ変数なんて変なものを使っているから、これはこれでなんか微妙だけどね。
ま、それでもかなりシンプルになっている、はず。

ちなみに、これを使ってもほとんど速度は向上しません。
ま、関数呼び出しの回数は変わってないどころか増えてるから、仕方ないね。

メモリ消費量は減る、かな？

そんな事より大事なのは、再帰回数の制限を超えられること。
何千回回そうとも止まらずに動いてくれる。素晴らしい。

言語仕様そのものに組み込まれたりすると、処理速度も向上したりするんだろうけれどねー。
どうっすか、偉い人？
