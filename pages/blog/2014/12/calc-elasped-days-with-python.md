---
title: pythonで経過日数を計算する。ライブラリは使わない。
pubtime: 2014-12-26T17:55:00+09:00
tags: [Python]
description: ある日付からの経過日数を計算するプログラムを、ライブラリを使わずに実装してみました。
---

[jskny氏の記事](http://www.risdy.net/2014/12/blog-post_56.html)に便乗した[さっきの記事](/blog/2014/12/calc-your-lived-days)はズルして楽に書いていたので、きちんと自分で日数を計算するコードを書いてみました。

基本的な手順はjskny氏のものと一緒なのだけれど、コードの見た目は全然違う。
for文の代わりにリスト内包表記を使うあたりがpythonic・・・なのかも？

ループも関数も使いまくりなので速度遅そうだけれど、意味と見た目が一致しているので吉とする。

``` python
import datetime

def isUruu(year):
    ''' 閏年か？
    '''
    assert isinstance(year, int)

    if year%%400 == 0:
        return True
    elif year%%100 == 0:
        return False
    elif year%%4 == 0:
        return True
    else:
        return False

def yearDays(year):
    ''' その年の日数を返す
    '''
    assert isinstance(year, int)

    return 365 + isUruu(year)

def monthDays(year, month):
    ''' その月の日数を返す
    '''
    assert isinstance(year, int) and isinstance(month, int)
    assert 1 <= month <= 12

    if month == 2:
        if isUruu(year):
            return 29
        else:
            return 28
    else:
        if month > 8:
            return 31 - month%%2
        else:
            return 30 + month%%2

def getToday():
    ''' 今日の日付を取得
    '''

    today = datetime.datetime.now()

    return today.year, today.month, today.day

def elapsedDays(year, month, day):
    ''' その日から今日までの日数を返す
    '''
    assert isinstance(year, int) and isinstance(month, int) and isinstance(day, int)
    assert 1 <= day <= monthDays(year, month)

    nowYear, nowMonth, nowDay = getToday()

    # 生まれた年の初めから今年の末までの日数を計算
    result = sum(yearDays(x) for x in range(year, nowYear+1))

    # 生まれた年の初めから生まれた日までの日数を引く
    result -= sum(monthDays(year, x) for x in range(1, month))
    result -= day

    # 今日から今年の末までの日数を引く
    result -= sum(monthDays(nowYear, x) for x in range(nowMonth+1, 13))
    result -= monthDays(nowYear, nowMonth) - nowDay + 1

    return result


print(elapsedDays(2014, 4, 1), 'days')
```
