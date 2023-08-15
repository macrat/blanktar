---
title: pythonのmatplotlib（とちょこっとpandas）でローソク足のチャートを書く
pubtime: 2015-12-19T16:57:00+09:00
amp: hybrid
tags: [Matplotlib, Pandas, ローソク足]
image: [/blog/2015/12/matplotlib-candles.png]
description: pythonのmatplotlibとpandasを使って、株やFXで使われるようなローソク足チャートを作成する方法のメモです。
---

pythonで株やFXなんかで使うローソク足チャートを書きたかったのですが、ちょっと苦戦したのでメモ。
完成品はこんな感じです。

![matplotlibで作ったローソク足チャート](/blog/2015/12/matplotlib-candles.png "800x600")

ソースコードはこんな感じ。
``` python
import pandas
import matplotlib.pyplot as plt
from matplotlib.finance import candlestick_ohlc


dat = pandas.read_csv('usdjpy.csv', parse_dates=['日付'])  # ファイルの読み込み。
dat = dat[-50:]  # データが多すぎるので減らす。

dates = dat['日付']  # あとでつかう。

tmp = dat['日付'].values.astype('datetime64[D]')  # ナノ秒精度とか無意味なので、精度を日単位まで落とす。
dat['日付'] = tmp.astype(float)  # Datetime64形式だと使えないので、floatに変換。

plt.xticks(  # 横軸の値と表示の対応の設定。[::5]はラベルを1週間ごとにするために使っている。
    dat['日付'][::5],
    [x.strftime('%Y-%m-%d') for x in dates][::5]
)
plt.grid()

ax = plt.subplot()
candlestick_ohlc(  # グラフを作る。
    ax,
    dat.values,  # 入力データ。左から順に、始値、高値、安値、終値にする。その後にデータが続いてても良いらしい。
    width=0.7,  # 棒の横幅。今回は日単位の精度に落としてあるので、0.7日分の幅になる。
    colorup='skyblue',
    colordown='black'
)

plt.show()
```
わりと簡単。

データファイルはマネースクウェア・ジャパンが[配布している](http://www.m2j.co.jp/market/historical.php)ドル円のcsvファイルを使う前提で書いています。
まあ、始値高値安値終値の順番が正しければなんでも良い。

`candlestick_ochl`なんて関数もあって、こっちは始値終値高値安値の順番になります。お好みで。

横軸の表示を設定する方法は色々あるようなのですが、もっとも単純っぽいこの方法にしました。
あまりにもデータ数が多いときには問題が出るかもしれませんが、そうでなければこれで良いはず。

お手軽にわりと綺麗なグラフが出て素敵なんですが、細かい調整はどうも出来ないようです。
箱に枠線を付けるとか、そういうのは無理っぽい。もしくはすごく面倒臭そう。

---

参考：
- [Candlestick OHLC graphs with Matplotlib - Python Programming Tutorials](https://pythonprogramming.net/candlestick-ohlc-graph-matplotlib-tutorial/)
- [python - plotting dates from time() since the epoch with matplotlib - Stack Overflow](http://stackoverflow.com/questions/17535065/plotting-dates-from-time-since-the-epoch-with-matplotlib)
- [finance &mdash; Matplotlib 1.5.0 documentatio](http://matplotlib.org/api/finance_api.html)
