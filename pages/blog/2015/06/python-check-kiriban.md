---
title: pythonでキリ番かどうか判定する
pubtime: 2015-06-30T23:23:00+09:00
tags: [Python, 正規表現]
description: Pythonを使って、ゾロ目や連番などのキリ番を検出するコードを書いてみた記録です。正規表現を使用する場合とpythonコードだけの2パターンあります。
---

pythonで与えられた数字がキリ番かどうかを判定するコード書きました。ほぼ正規表現です。
``` python
import re

def isKiri(x):
    if re.match('^([0-9])\\1+$', str(x)):  # ゾロ目
        return True

    if re.match('^[0-9]0+$', str(x)):  # 100とか200とか。（なんて言うんだ）
        return True

    if str(x) in '01234567890' or str(x) in '09876543210':  # 連番
        return True

    return False
```
こんな感じで。

連番だけちょっと綺麗じゃない感じになってしまった。
0123とかなら対応できるけど、7890123みたいのはダメ。まあ、そいつをキリ番に含めるのかどうかは知らないけれど。

``` python
def isKiri(x):
    if all(y == str(x)[0] for y in str(x)[1:]):  # ゾロ目
        return True

    if all(y == '0' for y in str(x)[1:]):  # 100とか200とか。（なんて言うんだ）
        return True

    if str(x) in '01234567890' or str(x) in '09876543210':  # 連番
        return True

    return False
```
正規表現使わないとこんな感じ。
大して長さは変わらないけれど、読みづらい。
