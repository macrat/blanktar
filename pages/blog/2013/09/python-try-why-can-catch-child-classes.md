---
title: pythonのexcept文にExceptionを渡すと色々まとめて捕捉できる理由
pubtime: 2013-09-15T00:42:00+09:00
tags: [Python, 言語仕様]
description: pythonのtry-except文で`Exception`を渡すとあらゆる例外をキャッチ出来ます。この機能のメカニズムに気付いたので、Python内部の挙動のメモです。
---

pythonにはtry文なんてのがあります。

まあ、スクリプト言語の基本っぽいよねー。
・・・ってのはどうでもよくて。

このtry文ってのは、
``` python
>>> try:
... 	raise SyntaxError('test')
... except SyntaxError as e:
... 	print 'cache:', e
cache: test
```
みたいな使い方だけでなく、
``` python
>>> try:
... 	raise SyntaxError('test')
... except Exception as e:
... 	print 'cache:', e
cache: test
```
なんて事ができる。
**Exception**って書くと、いろんな例外をまとめてキャッチできる。

何故か。という事に先ほど気づいたので、メモ。

pythonの組み込み例外はすべて**BaseException**ってやつから派生しています。
そして、原則として**BaseException**を継承した**Exception**ってのを継承して作られています。

で、だ。

except節に基底クラスを渡すと、派生クラスをまとめてキャッチするようになっているようです。

なので、except Exceptionってすると、大体の例外をキャッチしてくれる。
ちなみに、**KeyboardInterrupt**は**BaseException**から直に派生しているようで、キャッチされないようになっています。

つまり、自作の例外でも基底クラスを渡せば派生クラスをまとめて捕捉できる！
これは便利・・・かも、しれない？
