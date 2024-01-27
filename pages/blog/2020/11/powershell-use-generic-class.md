---
title: PowerShellでGenericなクラスとかメソッドを呼び出す
pubtime: 2020-11-05T18:24:00+09:00
tags: [PowerShell, 言語仕様, Windows]
description: PowerShellではC#の（正確には.NETの）機能を使えるのですが、ところどころ制約があったりします。Generic回りなどもそうで、動的型なPowerShellから使うためには少し型に気を使う必要があります。というわけで、PowerShellでGenericなクラスを扱う方法です。
image: [/blog/2020/11/powershell-use-generic-class.png]
faq:
  - question: PowerShellでGenericなクラスのコンストラクタやメソッドを呼びたい場合はどうしたら良い？
    answer: 引数の型を丁寧に明示してあげると上手くいくことがあるようです。
  - question: 'HashSet::newするときに「MethodException: Cannot find an overload for "new" and the argument count: "1".」ってエラーが出た。これは何？'
    answer: もしかしたら、引数の型が正しくないエラーかもしれません。
headers:
  Content-Security-Policy: "default-src 'self'; script-src 'self' 'unsafe-inline' https://platform.twitter.com/; style-src 'self' 'unsafe-inline' https://*.twitter.com/; img-src 'self' https://*.twitter.com/ https://*.twimg.com/; frame-src https://platform.twitter.com/ https://syndication.twitter.com/; frame-ancestors 'none'"
---

[昨日の記事](/blog/2020/11/powershell-unique-value-count)の中で[System.Collections.Generic.HashSet&lt;T&gt;](https://docs.microsoft.com/ja-jp/dotnet/api/system.collections.generic.hashset-1)というクラスを使いました。
この`HashSet<T>`というクラスのコンストラクタには`ICollection<T>`や`IEnumerable<T>`などの配列的な値を渡すことが出来て、集合の初期値とすることが出来ます。

使い方としては以下のような感じ。

``` ps1
PS> [System.Collections.Generic.HashSet[String]]::new(@("alice", "bob", "alice"))
```

これを実行すると以下のように…エラーになります。残念。

```
MethodException: Cannot find an overload for "new" and the argument count: "1".
```

同じような感じで、[HashSet&lt;T&gt;.UnionWith(IEnumerable&lt;T&gt;)](https://docs.microsoft.com/ja-jp/dotnet/api/system.collections.generic.hashset-1.unionwith)的なGenericな型が使われているメソッドも呼べません。

残念ながらPowerShellでは一部のコンストラクタやメンバは提供されていないみたい…と思っていたのですが、以下のような情報を頂きました。（ありがとうございます！）

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">PowerShellで配列内のユニークな値の数を数える <a href="https://t.co/GdepJQ28Gb">https://t.co/GdepJQ28Gb</a> <br><br>Powershellの配列からジェネリックを生成するときは[Tvalue[]]でキャストすると上手くいくというハックがあったり......<br><br>[HashSet[int]]::new([int[]]$ns).Count # これは上手くいく <a href="https://t.co/2kCZwxeBEJ">pic.twitter.com/2kCZwxeBEJ</a></p>&mdash; lu-anago (@lululu63499233) <a href="https://twitter.com/lululu63499233/status/1324020148500508673?ref_src=twsrc%5Etfw">November 4, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

エラー文は「引数が1個のnewってメソッドは無いよ」的な内容に見えるのですが、実際の意味は「引数の型が正しくない」的な意味のようです。

というわけで、引数を`String[]`にキャストしてあげたら行けました。

``` ps1
PS> [System.Collections.Generic.HashSet[String]]::new([String[]]@("alice", "bob", "alice"))
alice
bob
```

ちなみに、キャストする前の配列は`Object[]`だったようです。

``` ps1
PS> (@("alice", "bob", "alice")).GetType().Name
Object[]

PS> ([String[]]@("alice", "bob", "alice")).GetType().Name
String[]
```

コンストラクタだけでなく、メソッドについても同じことが言えます。

``` ps1
PS> $set = [System.Collections.Generic.HashSet[String]]::new()

PS> # これはダメ
PS> $set.UnionWith(@("alice", "bob"))
MethodException: Cannot find an overload for "UnionWith" and the argument count: "1".

PS> # こっちなら行ける
PS> $set.UnionWith([String[]]@("alice", "bob"))

PS> $set
alice
bob
```

うまく行きました。
分かれば分かるんですが、うーん…。
