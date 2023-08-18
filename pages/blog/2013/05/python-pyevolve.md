---
title: pythonのpyevolveで遺伝的アルゴリズム。
pubtime: 2013-05-01T01:05:00+09:00
tags: [Python, 機械学習, ライブラリの紹介]
description: Pythonの「pyevolve」というライブラリを使って、遺伝的アルゴリズムの実装を試してみました。
---

[前回](/blog/2013/04/what-is-genetic-algorithm)の予告通り、今回は遺伝的アルゴリズムを実装してみるよ。

[pyevolve](http://pyevolve.sourceforge.net/)っていうライブラリを使います。
portageには無いのよね。残念。

``` python
import random
from pyevolve import G1DList
from pyevolve import GSimpleGA

# まずは答えを作る。
# この答えに似てる程いい、って評価にしてみる。
answer = [random.randint(0, 9) for x in range(64)]

# 遺伝子を評価するための関数。
# 今回は１次元配列を使うので、chromesomeはそのまんま一次元の配列。
def EvalFunc(chromesome):
	score = 0.0
	for a, b in zip(answer, chromesome):
		if c == b:
			score += 1
	return score / len(answer)

# ゲノム（つまり遺伝子？）を作る。
genome = G1DList.G1DList(len(answer))

# 一つの要素が取る値の範囲を指定。
#  しなくてもおっけー。
genome.setParms(rangemin=0, rangemax=9)

# 評価関数を指定。
genome.evaluator.set(EvalFunc)

# 環境（シミュレーションを実行する単位）を作る。
ga = GSimpleGA.GSimpleGA(genome)

# 一世代の数を指定。
#  指定しないでもおっけー。デフォルト値は知らん。
ga.setGenerations(500)

# 計算を実行する。
#  freq_statusを指定しておくと、計算の経過を表示してくれる。
#  今回は10を指定してあるので、10世代ごとに表示される。
ga.evolve(freq_status=10)

# 一番良かった計算結果を取得
best = ga.bestIndividual()

# 結果を詳細に表示する
print best

# 出てきた答えと、そのスコアだけを表示する
print 'genome :', best.genomeList
print 'score :', best.getRawScore()
```
こんな感じで使えます。

手軽だよねー。
考えるべきは評価関数の事だけになるから、とっても楽ちん。
ま、評価関数作るのがむつかしいんだけれどね、大抵。
