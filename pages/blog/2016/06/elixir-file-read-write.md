---
title: Elixirでファイルを読んだり書いたり
pubtime: 2016-06-19T14:53:00+09:00
tags: [Elixir, 言語仕様]
description: Elixir言語を使って、ファイルの読み書きを試してみました。単発で書き込むだけの場合と、ファイルハンドラを使う方法の2種類があるようです。
---

昨日の[ディレクトリ操作](/blog/2016/06/elixir-file-handling)に引き続いて、本日は**Elixir**でファイル入出力をやってみます。

# 簡単な読み書き
単純に読み込む/書き込むだけならものすごく簡単で、以下のように出来ます。
```
iex> File.write "test.txt", "hello"
:ok
iex> File.read "test.txt"
{:ok, "hello"}

iex> File.write "test.txt", " world", [:append]
:ok
iex> File.read "test.txt"
{:ok, "hello world"}
```
一回目の書き込みが通常の上書き的な書き込み、二回目の書き込みが追記書き込みになっています。
`File.write`の第三引数にオプションを渡すわけですね。使えるオプションについては後述。

# ファイルハンドラを使った読み書き
一般的なopenしてwriteして…って流れでも読み書きが出来ます。以下のような感じ。
```
iex> File.write "test.txt", "はろーわーるど"
:ok

iex> {:ok, fp} = File.open "test.txt"
{:ok, #PID<0.100.0>}

iex> IO.binread fp, 3
"は"

iex> File.close fp
:ok
```
デフォルトでは読み込みモード、バイナリモード？で開かれるようです。
`IO.binread`の第二引数はバイト数です。3文字読みたかったのに1文字しか返って来ませんでした。

ファイルがutf-8で保存されているなら、utf-8モードが使えます。
```
iex> {:ok, fp} = File.open "test.txt", [:utf8]
{:ok, #PID<0.100.0>}

iex> IO.read fp, 3
"はろー"
iex> IO.read fp, 4
"わーるど"
iex> IO.read fp, 1
:eof

iex> File.close fp
:ok
```
`IO.binread`ではなくて`IO.read`になりました。ちゃんと文字数で指定出来ています。
ファイルの終了まで行ったら`:eof`が返るのもポイントですね。

書き込みも何の捻りもなく以下のように行ないます。
```
iex> {:ok, fp} = File.open "test.txt", [:write, utf8]
{:ok, #PID<0.100.0>}

iex> IO.binwrite fp, "はろー"
:ok

iex> File.close fp
:ok

iex> File.read "test.txt"
{:ok, "はろー"}
```
`open`するときにオプションに`:write`を渡すだけです。

# オプション
`:read`、`:write`はそのまんま読み込みモード/書き込みモードです。
両方指定すると読み書き両方出来るようになります。
`:read`を指定しているときは存在しないとエラーに、`:write`を指定しているときは存在しなければ作るようです。

`:append`を指定すると追記書き込みになります。上でちょこっと使ったやつです。
存在しない場合は新規作成になります。

`:exclusive`オプションを`:write`と同時に使うと、ファイルが存在するとエラーが返るようになります。
新規作成だけを認める場合に使うオプションですね。

`:char_list`や`:utf8`を使うと読み込んだときに返る型を決められるようです。
何も付けないとbinaryで返るようになっています。
エンコーディングについては`:utf16`や`utf32`、`:big`、`:little`など、色々オプションがあるようです。

`:compressed`を付けるとファイルがgzipで圧縮されるようになります。
圧縮レベルなどのオプションもあるのかもしれませんが、見付けられませんでした。

`:delayed_write`か`:sync`を付けると、書き込みを即座に行なうかバッファするかを選べます。
デフォルトでは`:sync`のようです。細かく沢山書き込むときは`:delayed_write`にしておくのが賢いのかも？

---

参考：
- [File - Elixir v1.2.5](http://elixir-lang.org/docs/stable/elixir/File.html)
- [IO - Elixir v1.2.5](http://elixir-lang.org/docs/stable/elixir/IO.html)
