---
title: PowerShellでgrep -oみたく正規表現にマッチしたところだけ抜き出す
pubtime: 2020-07-10T19:59:00+09:00
amp: hybrid
tags: [PowerShell, 正規表現, コマンド, シェル, grep]
description: Linuxで使える「grep -o」コマンドを使うと、正規表現にマッチした部分だけ取り出せて非常に便利です。WindowsのPowerShellの場合はそんな感じのオプションは無いらしく…組み合わせで同じ挙動を実現する方法を調べてみました。
---

正規表現にマッチした部分だけを抜き出したい みたいな状況は結構ある気がします。
適当なファイルからURLっぽいところだけ取り出したいとか、HTMLから特定のタグを取得したいとか。

例として、ここでは以下のファイル（っていうかメール？）からメールアドレス取り出してみます。
簡略化のために、メールの正規表現は`[-_.a-zA-Z0-9]+@[-_.a-zA-Z0-9]+`で良いということにします。

```
Subject: hello world!
To: alice@example.com
From: Bob@example.com

hello alice!!
```


# Linuxの場合

Linuxであれば、以下のようなコマンドで正規表現マッチを取り出すことが出来ます。

``` shell
$ grep -io '[-_.a-z0-9]\+@[-_.a-z0-9]\+' ./input.txt
alice@example.com
Bob@example.com
```

`-o`オプションを付けるとマッチ部分だけ出力されます。
ついでに`-i`を付けて、大文字小文字を無視するようにしています。


# PowerShellの場合

PowerShellの場合、grepコマンドに相当する[Select-String](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-string?view=powershell-7)というコマンドがあるようです。
`sls`ってエイリアスもあるっぽい。

``` powershell
> Get-Content .\input.txt | Select-String '[-_.a-z0-9]+@[-_.a-z0-9]+'
To: alice@example.com
From: Bob@example.com
```

単純に使うとこんな感じ。デフォルトで大文字小文字を無視するようになっています。

残念ながら、このコマンドには`-o`に相当する機能がありません。
その代わりに出力がオブジェクト（構造体？ クラス？）になっているので、`ForEach-Object`でマッチ部分を取り出すことが出来ます。

``` powershell
> Get-Content .\input.txt | Select-String '[-_.a-z0-9]+@[-_.a-z0-9]+' | ForEach-Object { $_.Matches.Value }
alice@example.com
Bob@example.com
```

うーん、長い。
省略形を使うと以下のような感じになります。

``` powershell
> cat .\input.txt | sls '[-_.a-z0-9]+@[-_.a-z0-9]+' | % { $_.Matches.Value }
alice@example.com
Bob@example.com
```

うーん、わかりづらい。

---

参考: [analog command grep -o in Powershell - Stack Overflow](https://stackoverflow.com/questions/16897955/analog-command-grep-o-in-powershell)
