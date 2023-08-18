---
title: 世界最強のセキュリティソフト作ったったｗｗｗ（ネタ
pubtime: 2013-06-09T21:49:00+09:00
tags: [Python, ネタ]
description: ほこxたての放送が面白かったので、便乗してセキュリティソフトを作ってみました。これはネタです。完全にネタです。
---

今日のほこxたて見ててさ、びっくししたよ。
たとえ世界最強のハッカーと言えども、やっぱり防ぐ手段はあるんだね。
それは驚きの**ファイル名を変えちゃう**いう手法。
いやー、すごい。その発想はなかった。

という訳で、それを自動化するソフトを作ったよ。
1分置きぐらいにファイル名を変えちゃえば最強だね！　やったね！
``` python
import sys
import os
import time
import random
import string

LETTERS = string.letters + string.digits

def GetDirs(name):
	ret = []
	for path, dnames, fnames in os.walk(name):
		ret += [os.path.join(path, d) for d in dnames]
	return ret

def GetFiles(name):
	ret = []
	if os.path.isdir(name):
		for path, dnames, fnames in os.walk(name):
			ret += [os.path.join(path, f) for f in fnames]
	elif os.path.isfile(name):
		ret.append(name)
	else:
		raise IOError('No such file or directory')
	return ret

def RandomString(length=32):
	return ''.join([random.choice(LETTERS) for i in range(length)])

def AutoRename(name):
	path = os.path.split(name)[0]
	ext = os.path.splitext(name)[1]
	print name, '-&gt;', os.path.join(path, RandomString() + ext)
	os.rename(name, os.path.join(path, RandomString() + ext))

if __name__ == '__main__':
	if len(sys.argv) &lt;= 1:
		print&gt;&gt;sys.stderr, '{0} [file | directory] (interval)'.format(sys.argv[0])
		sys.exit(-1)

	try:
		interval = int(sys.argv[2])
	except (IndexError, ValueError):
		interval = 0

	while True:
		if os.path.isdir(sys.argv[1]):
			for dir in GetDirs(sys.argv[1]):
				AutoRename(dir)
		for fname in GetFiles(sys.argv[1]):
			AutoRename(fname)
		print

		if interval &gt; 0:
			time.sleep(interval)
		else:
			break
```

こいつを例えばsecure.pyって名前で保存したら
``` shell
$ secure.py test 60
```
みたいに使ってください。

60秒おきに、testってファイルを適当な名前にリネームします。
testがディレクトリなら、test以下のファイルすべてをリネーム。

いやー、これで安心だね！

<em style={{color: 'var(--colors-accent)', fontWeight: 'bold'}}>嘘です。こんなんじゃ何も守れません。ネタです。</em>
