---
title: ElixirのAgentモジュールを使って値の更新とかメモ化とか
pubtime: 2016-06-21T17:26:00+09:00
tags: [Elixir, 標準ライブラリ]
description: Elixirという言語では変数の変更が出来ないため、代わりに使う「Agent」というものを試してみました。ここでは、アクセスカウンターのようなものと変数のメモ化を試しています。
---

Elixirの変数は変更不能らしいです。変化出来ない数、変数。ふしぎ。
安全性が高くて良いのですが、Webのアクセスカウンター的なものを作りたいときとか、メモ化とかやりたいときに困ります。
というときに登場するのが[Agent](http://elixir-lang.org/docs/stable/elixir/Agent.html)ってやつらしいです。

# とりあえず使ってみる
```
defmodule Counter do
    def counter do
    Agent.update(:counter, fn x -> x + 1 end)
    Agent.get(:counter, fn x -> x end)
    end

    def start_agent do
    Agent.start_link fn -> 0 end, name: :counter
    end
end

Counter.start_agent
IO.inspect Counter.counter
IO.inspect Counter.counter
IO.inspect Counter.counter
```
こんな感じで使います。

`Counter.start_agent`関数でAgentとやらを開始しています。スレッドみたいなもので、変数を保持しておいてくれるらしい。
第一引数は初期値を返す関数で、第二引数は識別子を渡しています。
識別子さえ変えておけば複数のAgentを立ち上げても大丈夫。

`Counter.counter`関数を実行すると、`Agent.update`関数を使って値を更新して、`Agent.get`関数で値を取得しています。
単純にカウントするだけだけどちょっと面倒臭い…。

# メモ化のために使ってみる
メモ化といえばフィボナッチ数ということで、フィボナッチ数の実装をやってみました。
```
defmodule Memorize do
    def fib 0 do
    0
    end

    def fib 1 do
    1
    end

    def fib x do
    case Agent.get(:fib_memo, &Map.get(&1, x)) do
        nil ->
        v = fib(x - 1) + fib(x - 2)
        Agent.update(:fib_memo, &Map.put(&1, x, v))
        v

        v -> v
    end
    end

    def start_agent do
    Agent.start_link &Map.new/0, name: :fib_memo
    end
end


Memorize.start_agent
IO.inspect Memorize.fib 1024
```
Agentにmapを持っておいてもらって、`fib`関数が呼ばれる度に検索しにいっています。
見付かったらその値をそのまま返し、無ければ計算して保存する感じ。

メモ化しておけば1024とかで計算させてもすごいスピードが出ます。
事実上は1024回ループが回ってるだけだからね。

---

なんだか面倒臭い感じがするのですが、向いてないってことなのかなぁ…。

参考： [Go VS Elixir (1)フィボナッチ数列 - 技術備忘記](http://junchang1031.hatenablog.com/entry/2015/12/09/021113)
