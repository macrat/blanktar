---
title: jinja2の関数が結構便利でびっくり。
pubtime: 2014-02-11T18:11:00+09:00
amp: hybrid
tags: [Python, Jinja, テンプレート, マクロ]
description: pythonのflaskやdjangoで使われるテンプレートエンジンである「jinja2」のマクロの使い方です。関数のようなイメージで、わりと色々なことが出来ます。
---

サイトをちょっと綺麗に改修してみました。
具体的に何をやったかというと、htmlを生成するのに使ってる**jinja2**のテンプレートのリファクタリングがメイン。
重複してる部分が多かったからね。

で、その時に使ったのが**macro**って機能。

たとえば、
``` html
<a href="linkA">えー</a>
<a href="linkB">びー</a>
<a href="linkC">しー</a>
```
みたいなコードがあったとして。

このままだと全部のリンクにclassを設定したいとかってときに面倒くさいので
``` jinja2
{% macro link(text, to) %}<a href="{{ to }}">{{ text }}</a>{% endmacro %}
```
ってマクロを用意して

``` jinja2
{{ link("えー", "linkA") }}
{{ link("びー", "linkB") }}
{{ link("しー", "linkC") }}
```
みたいに出来る。
複雑なことするなら便利だよね。

ちなみに、他のファイル（たとえばmacro.html）に書いて
``` jinja2
{% import "macro.html" as macro %}
```
なんてインポートして、
``` jinja2
{{ macro.link("でぃー", "linkD") }}
```
みたいに使うことも出来る。

``` jinja2
{% from "macro-library.html" import link %}
```
ってやれば特定のマクロだけインポートできる。もう普通にpython。
