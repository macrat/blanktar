---
title: pythonのdoctestのカバレッジを取る
pubtime: 2015-08-27T16:27:00+09:00
tags: [Python, テスト, コマンド]
description: pythonのcoverageというツールを使って、doctestを使ってコメントの中に書いたテストのカバレッジを取得する方法です。テキスト形式やHTML形式などの出力を試しました。
---

しばらく前に[unittestのカバレッジを取る方法](/blog/2015/03/python-unittest-coverage)を書きましたが、このとき使った<strong>coverage</strong>は<strong>doctest</strong>のカバレッジも取れるらしいです。
doctestについては[簡単な解説記事](/blog/2013/05/python-doctest)がありますのでそちらもどうぞ。

まずはインストール。
pip/easy\_installなら`coverage`、apt-getなら`python-coverage-test-runner`のようですが試していません。
少なくともgentooでは`dev-python/coverage`です。

インストール出来たら、テスト対象のソースを用意します。
``` python
def test(x):
    """ test function

    >>> test(10)
    'plus'
    >>> test(1)
    'plus'
    >>> test(-1)
    'minus'
    """

    if x > 0:
        return 'plus'
    elif x < 0:
        return 'minus'
    else:
        return 'zero'
```
今回はこんな感じで。`test.py`とでもしておきましょうか。
一番最後の`return 'zero'`のところだけカバーされていないテストですね。

テスト実行用にソースコードの末尾に以下の三行を追加してきます。
``` python
if __name__ == '__main__':
    import doctest
    doctest.testmod()
```
こうすれば単純にソースを実行するだけでテストを実行できる。

準備が出来たら、テストを実行します。やり方はunittestの時と一緒。
``` shell
$ coverage run test.py
```
問題なければ何も表示されません。

詳細を見たければ
``` shell
$ coverage run test.py -v
```
とでもすると良いかも。

コンソールアプリケーションなどで追加した三行を入れるわけにはいかない場合。そんなときは、以下のようにしてテストを実行します。
``` shell
$ coverage run -m doctest test.py
```
`python -m doctest test.py`みたいな感じで分りやすくて良い。

テストが完了したら、以下のコマンドでレポートを出力。これもunittestと一緒です。というか全部一緒です。
```
$ coverage annotate test.py
$ cat test.py,cover
> def test(x):
> 	""" test function

> 	>>> test(10)
> 	'plus'
> 	>>> test(1)
> 	'plus'
> 	>>> test(-1)
> 	'minus'
> 	"""

> 	if x > 0:
> 		return 'plus'
> 	elif x < 0:
> 		return 'minus'
! 	else:
! 		return 'zero'


> if __name__ == '__main__':
> 	import doctest
> 	doctest.testmod()
```
一行目のコマンドでレポートを吐かせて、二行目で内容を確認しています。
`>`で始まる行はテスト済み、`!`で始まる行は未テストです。
`return 'zero'`がテストされていないのが一目で…分かる、かも？

やっぱり見づらいので、HTML形式で出力しましょう。
``` shell
$ coverage html test.py
$ xdg-open htmlcov/index.html
```
一行目でレポート出力、二行目でブラウザを開いて表示、です。
未テストのところに赤く色が付くのでかなり見やすい。

以下のようにするとカバレッジだけ表示されるので、てっとり早くそこだけ確認したい場合にどうぞ。
```
$ coverage report
Name    Stmts   Miss  Cover
---------------------------
test        9      1    89%
```
これだけ見たい場面ってのも少なそうな気がするけれど、どうなんだろう？

あと片づけは
``` shell
$ coverage erase
$ *,cover
$ rm -r htmlcov
```
こんな感じで。若干面倒ですね。

こうやってカバレッジ取ってくれるととても楽しいのですが、楽しすぎてdoctestの方がソースより長くなったりして、うぅむ。
カバレッジ取ってまできちんとテストするときはunittest使うべきなんだろうなぁ…。

参考： [ned / coverage.py / 課題 / #152 - can&#39;t get coverage to run doctests &mdash; Bitbucket](https://bitbucket.org/ned/coveragepy/issues/152/cant-get-coverage-to-run-doctests)
