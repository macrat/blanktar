---
title: PowerShellでスクリプトとして呼ばれた時だけ何かする
pubtime: 2020-08-25T19:01:00+09:00
tags: [PowerShell, 言語仕様, Windows]
description: '普通に実行すると便利なスクリプト、ドットソース演算子で実行するとモジュール的に使える。というようなスクリプトをPowerShellで作る方法です。Pythonで言う`if __name__ == "__main__"`みたいな感じのやつ。'
---

なんだか最近PowerShellを書く機会が多いのですが、沢山書いていると使い回したくなるのが人の性。
そして使い回していると、テストしたりして品質保証をしたくなります。

そうなるとちょっと困るのが、以下のようなスクリプトのテストの仕方。

``` powershell
function さぎょう {
    何かすごく大変な作業
}

さぎょう > どこか
```

バッチファイルっぽく単体で使う分には便利なのですが、これをテストのために別のスクリプトから読み込もうとすると重い*さぎょう*が走ったり*どこか*に何かが保存されたりしてしまいます。
これだとかなりテストがしづらいし再利用も出来そうにありません。

Pythonの場合、これを防ぐために以下のような書き方をするのが一般的です。

``` python
def さぎょう():
    pass

if __name__ == "__main__":
    どこか.write(さぎょう())
```

コンソールから実行されたときは`__name__`変数が`"__main__"`になるので*さぎょう*が実施されますが、モジュールとしてimportした場合は`__name__`の中身はモジュール名になるので*さぎょう*は実施されません。
便利。

これと同じことを、PowerShellスクリプトでやる方法を調べてみました。


# 自分がなんてコマンドで読み込まれたのかを調べる

PowerShellには、`$MyInvocation`という変数が定義されているそうです。
なんかすごくサンプル変数名感のある変数名ですが、そういう名前で固定です。

この変数を読めば、自分がどう実行されたか、今どこを実行しているかなどが分かるようです。

コンソールでこの変数を見てみると、以下のような感じになっています。
ほとんど中身が無い状態。

``` powershell
> $MyInvocation

MyCommand             : $MyInvocation
BoundParameters       : {}
UnboundArguments      : {}
ScriptLineNumber      : 0
OffsetInLine          : 0
HistoryId             : 1
ScriptName            :
Line                  :
PositionMessage       :
PSScriptRoot          :
PSCommandPath         :
InvocationName        :
PipelineLength        : 2
PipelinePosition      : 1
ExpectingInput        : False
CommandOrigin         : Runspace
DisplayScriptPosition :
```

一方、スクリプトファイルの中身から見ると以下のようになります。

``` powershell
> echo '$MyInvocation' > test.ps1

> ./test.ps1

MyCommand             : test.ps1
BoundParameters       : {}
UnboundArguments      : {}
ScriptLineNumber      : 1
OffsetInLine          : 1
HistoryId             : 3
ScriptName            :
Line                  : ./test.ps1
PositionMessage       : At line:1 char:1
                        + ./test.ps1
                        + ~~~~~~~~~
PSScriptRoot          :
PSCommandPath         :
InvocationName        : ./test.ps1
PipelineLength        : 1
PipelinePosition      : 1
ExpectingInput        : False
CommandOrigin         : Runspace
DisplayScriptPosition :
```

今回の目的に使えそうなのは、`InvocationName`の部分。
ここに、実行時のコマンド名（引数を除く）が入ります。

色んな呼び出し方で試してみると以下のような感じ。

``` powershell
> echo '$MyInvocation.InvocationName' > test.ps1

# スクリプト的に呼んだ場合
> ./test.ps1
./test.ps1

# モジュール的にドットソース演算子で読み込んだ場合
> . ./test.ps1
.

# 呼び出し演算子で実行した場合（右クリックして「PowerShellで実行」とかはこれ）
> & ./test.ps1
&
```

この変数を使って、どうやって呼び出し方をしたか分岐が出来そうです。


# スクリプトとして呼ばれた時だけ何かする

というわけで、`$MyInvocation.InvocationName`を使って分岐してみた例が以下になります。

``` powershell
function さぎょう {
    何かすごく大変な作業
}

if ($MyInvocation.InvocationName -ne ".") {
    さぎょう > どこか
}
```

これなら他のスクリプトから`. ./test.ps1`のように読み込んだ場合は読み書きや処理が発生しないので、テストも容易です。やったね。

`&`かどうかで右クリックから実行したかコンソールから実行したかの分岐も出来るかもしれません。もしかしたら。
（ほかに`&`で呼ばれる場面が思いつかないけれど、もしあったらダメかも）

---

参考: [PowerShell Deep Dive: Using $MyInvocation and Invoke-Expression to support dot-sourcing and direct invocation in shared PowerShell scripts &#8211; Poshoholic](https://poshoholic.com/2008/03/18/powershell-deep-dive-using-myinvocation-and-invoke-expression-to-support-dot-sourcing-and-direct-invocation-in-shared-powershell-scripts/)
