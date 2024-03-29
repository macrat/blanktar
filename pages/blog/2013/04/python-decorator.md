---
title: pythonのデコレータを使ってお手軽ベンチマーク
pubtime: 2013-04-16T14:26:00+09:00
tags: [Python, テスト, 言語仕様]
description: Pythonでデコレータを使って、お手軽に関数単位のベンチマークを取る方法です。
---

pythonにはデコレータというよく分からないものがありまして。
よく分からないので込み入った解説はしないけれど、ともかく関数をデコレーションするもののようです。

使い方は簡単　・・・かは分からないけれど、まあそれなりに。
``` python
import time
import functools

def Timer(func):
	@functools.wraps(func)
	def Wrapper(*args, **kw):
		stime = time.clock()
		ret = func(*args, **kw)
		etime = time.clock()
		print '{0}: {1:,f}ms'.format(func.__name__, (etime-stime)*1000)
		return ret
	return Wrapper

@Timer
def Test():
	print 'hello, decorator'

Test()
```
こんな感じで使うと、Test関数の実行時間を測ってくれます。計測対象はいくつでもおっけー。

計りたい関数の上に一行付け足すだけだから、お手軽でいいよね。
ミリ秒単位で測ってる割に関数のオーバーヘッドを考慮してないから、あんまよろしくないですが。

デコレーターに引数を付けたい時は
``` python
import time
import functools

def Timer(name):
	def Deco(func):
		@functools.wraps(func)
		def Wrapper(*args, **kw):
			stime = time.clock()
			ret = func(*args, **kw)
			etime = time.clock()
			print '{0}: {1:,f}ms'.format(name, (etime-stime)*1000)
			return ret
		return Wrapper
	return Deco

@Timer('decorator test')
def Test():
	print 'hello, decorator'

Test()
```
なんてやればおっけー。
三重のdefとかあんまり使いたくないけどね・・・見づらい・・・。

ちなみに、内部的には
``` python
def Deco(func):
	def Wrapper(*args, **kw):
		print func.__name__
		return func(*args, **kw)
	return Wrapper

def Test():
	print 'a'

Test = Deco(Test)
```
ってやるのと同義みたいね。

引数付きの場合は
``` python
Test = Deco(u'引数')(Test)
```
ということになるみたい。

じゃあ`@functools.wraps(func)`は何かって？　それが分からんのだよ。
省略すると、複数の関数をデコレーションした時におかしくなるんだけどね。後はよく分からん。
