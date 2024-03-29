---
title: python3.4を使うならpathlibを使おう
pubtime: 2015-07-16T15:05:00+09:00
tags: [Python, 標準ライブラリ]
description: Python3.4以降から標準ライブラリに入った「pathlib」という便利なファイルパス操作用のライブラリの解説です。かなり便利です。
---

pythonでファイルの有無を確認したりファイルの一覧を取得したりといったパス操作をするなら、**os.path**を使うのが普通です。
でもどうやら、今後普通でなくなっていくのかもしれません。
というのも、python3.4から**pathlib**という便利ライブラリが追加されているのです。
まあ御託はいいから試そうか。

# 基本的なこと
pathlibはオブジェクト指向です。なので、とりあえずインスタンスを作ります。
``` python
>>> pathlib.Path('./')
PosixPath('.')
```
こんな感じ。こうするとカレントディレクトリを表すオブジェクトを作ることができます。
\*NIX系で試したので`PosixPath`になっていますが、windowsなら`WindowsPath`になるようです。まあ機能は変わらんようなので無視。

ファイルを表す場合も同じで
``` python
>>> pathlib.Path('test')
PosixPath('test')
```
こんな感じ。

ファイルかディレクトリかの判断は
``` python
>>> pathlib.Path('./').is_dir()
True
>>> pathlib.Path('./file.txt').is_dir()
False
```
こんな感じでやります。

同じような感じで
``` python
>>> pathlib.Path('./hoge').exists() == os.path.exists('./hoge')
True
>>> pathlib.Path('./hoge').is_file() == os.path.isfile('./hoge')
True
>>> pathlib.Path('./hoge').is_symlink() == os.path.islink('./hoge')
True
```
os.pathにあったものは（多分）なんでも出来ます。

パス名の結合は`/`演算子を使います。割り算かよキモチワルイ。
``` python
>>> pathlib.Path('hoge') / pathlib.Path('fuga')
PosixPath('hoge/fuga')
>>> pathlib.Path('foo') / 'bar'
PosixPath('foo/bar')
>>> 'aa' / pathlib.Path('bb')
PosixPath('aa/bb')
```
こんな感じ。うーん・・・。

相対パスから絶対パスにするときはresolveを使って
``` python
>>> pathlib.Path('../').resolve()
PosixPath('/home')
```
こんな感じ。パスは適当なのでこうなるとは限らないことに注意。

絶対パスから相対パスにするときは
``` python
>>> pathlib.Path('/home/test').relative_to('/home/')
PosixPath('test')
```
こんな。`/home/`をから見た`/home/test`の相対パスを取得する。

# ディレクトリの操作
さて、とりあえずカレントディレクトリのファイル一覧を取得してみましょう。
``` python
>>> pathlib.Path('./').iterdir()
<generator object iterdir at 0x10100af78>
>>> tuple(pathlib.Path('./').iterdir())
(PosixPath('.bash_history'), PosixPath('.bash_profile'), PosixPath('.cache'), ...)
```
長いので適当に省略。だいたいこんな感じ。
ご覧のとおり、**iterdir**メソッドを呼び出すとイテレータを返してくれます。

**iterdir**は`os.listdir`と同じ感じなのですが、なんとglobモジュールの機能も統合されています。
``` python
>>> tuple(pathlib.Path('./').glob('.bash_*'))
(PosixPath('.bash_history'), PosixPath('.bash_profile'))
```
こんな感じ。とっても便利。

新しくディレクトリを作るときは
``` python
>>> pathlib.Path('./new-directory').mkdir()
```
こんな感じ。

`os.mkdir`と同じく、親ディレクトリが存在しない場合は例外を送出します。送出される例外は`FileNotFoundError`ってやつ。
``` python
>>> pathlib.Path('./new/direc/tory').mkdir(parents=True)
```
のようにすればエラーが起こらない。`os.makedirs`のような挙動になります。

ディレクトリを消したいときは
``` python
>>> pathlib.Path('./dust').rmdir()
```
のような感じで。
残念ながらparents引数はありません。

# ファイルの操作
pathlib.Pathクラスから直接ファイルを開くことが出来ます。
``` python
>>> pathlib.Path('./hoge.txt').open()
<_io.TextIOWrapper name='hoge.txt' mode='r' encoding='UTF-8'>
>>> pathlib.Path('./fuga.dat').open()
<_io.BufferedReader name='fuga.dat'>
```
こんな感じ。
組み込み関数の**open**とほぼ同じで、ファイル名を与えないだけって感じ。引数諸々がほぼそのまま使えます。
with文も使えるので、本当にopenと同じ感覚で使えるはず。

ファイルを削除するときは
``` python
>>> pathlib.Path('./hoge.txt').unlink()
```
って感じ。removeではないんだね。
ディレクトリは消せないので注意です。**rmdir**使ってください。

ファイル名だけを取得するときは
``` python
>>> pathlib.Path('/home/hoge/test.txt').name
'test.txt'
```
こんな感じ。

拡張子の取得は
``` python
>>> pathlib.Path('/home/hoge/test.tar.gz').suffix
'.gz'
>>> pathlib.Path('/home/hoge/test.tar.gz').suffixes
['.tar', '.gz']
```
こんな感じで。suffixesが結構便利そうで嬉しい。

拡張子を外したいときはprefixではなく
``` python
>>> pathlib.Path('/home/hoge/test.tar.gz').stem
'test.tar'
```
こんな感じ。stems的なものはない。

---

とりあえずこの辺りが使えれば大体使えるのではないでしょうか。多分。
かなり便利な感じがするので、一度[リファレンス](http://docs.python.jp/3/library/pathlib.html)をさらっと眺めてみることをお勧めします。
