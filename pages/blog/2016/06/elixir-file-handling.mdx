---
title: Elixirでファイルの一覧とかのディレクトリ操作
pubtime: 2016-06-18T20:43+0900
tags: [Elixir, ファイル操作, File, ディレクトリ]
---

何を思ったのか、**Elixir**なる言語を触り始めました。
なんだかよく分かりませんが、なんだかとっても楽しい言語です。
ただ、新しい言語だけあってやたらとドキュメントが無いのがかなしい。

で、この記事はElixirを使ったディレクトリの操作についてのまとめです。

<PS time="2016-06-19">
<a href="/blog/2016/06/elixir-file-read-write.html">ファイルの読み書きについての記事</a>も書きました。併せてどうぞ。
</PS>

## ファイルの存在確認
あるファイルが存在するかどうか確認するには`File.exists?`関数を使います。
```
iex> File.exists? "/"
true
```

## ディレクトリかどうか調べる
ファイルなのかディレクトリなのかを見分けるには`File.dir?`関数を使います。
```
iex> File.dir? "/dev"
true
iex> File.dir? "/dev/null"
false
```

## ディレクトリの中身を見る
`File.ls`関数でファイル/ディレクトリの一覧を取得出来ます。
```
iex> File.ls
{:ok, ["files", "of", "current", "directory"]}
iex> File.ls "/path/to/directory"
{:ok, ["hoge.txt", "fuga.mp3", "foo.png"]}
```
引数省略でカレントディレクトリの情報を取得出来るとか、まんまシェルのlsコマンドって感じ。

## カレントディレクトリを変える
ls関数があれば`cd`関数もあります。
```
iex> File.cd "/path/to/dir"
:ok
```
lsでは引数省略が出来ますが、こっちは引数省略は出来ないようです。

`cwd`関数でカレントディレクトリを取得出来ます。
```
iex> File.cwd
{:ok, "/mnt"}
```

## ディレクトリを作ったり消したり
ディレクトリの作成は`mkdir`関数で。
`mkdir_p`関数を使うと親ディレクトリも込みで作ってくれます。
```
iex> File.ls
{:ok, []}
iex> File.mkdir "dir"
:ok
iex> File.mkdir_p "path/to/dir"
:ok
File.ls
{:ok, ["dir", "path"]}
```
普通にシェルって感じです。

ディレクトリの削除には`rmdir`関数を使います。
`rmdir`関数は空のディレクトリしか消せませんが、`rm_rf`関数を使えば中身があっても消せます。もう完全にシェルって感じです。
```
iex> File.mkdir_p "hoge/fuga/foo"
:ok
iex> File.rmdir "hoge/fuga"
{:error, :eexist}
iex> File.rm_rf "hoge/fuga"
{:ok, ["hoge/fuga", "hoge/fuga/foo"]}
iex> File.rmdir "hoge"
:ok
```

## エラーチェックを省略する
ここまでの例では、戻り値の最初の値は全て:okや:errorになっていました。
Elixirではこの値を使ってエラーチェックをするのが通常らしいです。

エラーチェックが面倒臭かったら、関数名の後に感嘆符を付けると良いようです。
感嘆符を付けた関数を使うと、戻り値で失敗を伝える代わりに例外を投げてくれるようになります。

こんな感じ。
```
iex> File.ls "not-found-directory"
{:error, :enoent}
iex> File.ls! "not-found-directory"
** (File.Error) could not list directory not-found-directory: no such file or directory
  (elixir) lib/file.ex:1167: File.ls!/1
```
`ls`以外の関数でも`File`モジュールの中の関数ではだいたい使えるっぽいです。


参考： [File - Elixir v1.2.5](http://elixir-lang.org/docs/stable/elixir/File.html)
