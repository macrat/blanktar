---
title: pythonの三項演算子
pubtime: 2013-05-03T02:09:00+09:00
tags: [Python, 言語仕様]
description: "Pythonで「x == 1 ? \"a\" : \"b\"」みたいな三項演算子を書く方法です。"
---

聞くところによれば、なんとpythonにも三項演算子があるらしい。
三項演算子ってアレね、Cだと`a = a >= 255 ? 0 : a+1`みたいなやつね。

pythonでCの例と同じ事をしようとすると
``` python
a = a+1 if a >= 255 else 0
```
みたいな。

うーむ。 ・・・なんかさ、キモい。
Cの構文のが好きだなぁ・・・。まあ、pythonっぽくないのはそうだけれど。
