---
title: python標準のunittestのカバレッジを取る
pubtime: 2015-03-20T16:22:00+09:00
modtime: 2015-08-28T00:00:00+09:00
amp: hybrid
tags: [Python, 単体テスト, unittest, カバレッジ]
description: Pythonのunittestモジュールで行なった単体テストのカバレッジを取るツール「coverage」の使い方の解説です。
---

<PS date="2015-08-28" level={1}>

<a href="/blog/2015/08/python-doctest-coverage">doctestのカバレッジを取る方法</a>も書きました。といっても同じツールでほぼ同じ使い方です。素敵。

</PS>

python標準ライブラリの中には**unittest**と言う単体テスト用のモジュールがありまして、案外これが便利だったりします。
テストのためだけに環境整えるのは面倒だし、かと言ってテストしないどくには不安だし・・・って時にでも？
[前に紹介した](/blog/2013/05/python-doctest)**doctest**よりも面倒な分ちょっと高度な事が出来る、って感じかな。

そのunittestの使い方については[公式のドキュメント](http://docs.python.jp/3.4/library/unittest.html)に譲るとして、この記事ではunittestで書いたテストのカバレッジを見る方法について。

**カバレッジ**と言うのは、テストがプログラムをカバーしている割合、だそうです。全体のプログラムのうち、何パーセントがテストされている、的な。

今回使うのは**coverage**と言うツール。そのまんまの名前だ。

gentooならportageにあるので
```
# emerge coverage
```
で入ります。
ubuntuとかでもpython-coverageで入る、らしい？ 試してませんが。

テスト対象のプログラムを`main.py`、テストケースを`test.py`としておきましょう。
```
$ coverage run test.py
```
でテストを実行します。python2.xの場合は`coverage2`コマンドで。

テストが終わったら、
```
$ coverage report
```
でモジュール毎のカバレッジを見ることが出来ます。
```
$ coverage report main.py
```
とすれば目的のモジュールのカバレッジだけ見ることも可能。

```
$ coverage annotate main.py
$ cat main.py,cover
```
としてあげると、どの行がテストされていてどの行がテストされていないのかを見ることが出来ます。

`>`から始まっている行がテスト済み、`!`から始まっている行は未テスト。
モジュール名を省略するとすべてのモジュールのレポートを書き出してくれるみたい。

とはいえテキスト形式だとちょっと見辛いので、HTMLで出力するのがおすすめ。
HTML出力は
```
$ coverage html
```
こんな感じで。*htmlcov/index.html*ってファイルを開くとかなりいい感じに見せてくれます。

見終わったら、
```
$ coverage erase
```
とするとテスト結果を保存したファイル（./.coverage）を削除してくれます。
,coverファイルやhtmlcovディレクトリは削除されないので、こっちは手動で。

なかなか素晴らしいぞこのツール。便利。

参考： [PythonでUnitTestとCodeCoverageをやってみる（２）  - HDEラボ](http://lab.hde.co.jp/2008/07/pythonunittestcodecoverage-1.html)
