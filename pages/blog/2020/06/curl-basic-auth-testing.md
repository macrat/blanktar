---
title: curlでBASIC認証の動作確認をする
pubtime: 2020-06-27T12:24:00+09:00
tags: [curl, コマンド, セキュリティ, テスト, Web]
description: HTTPのBASIC認証を使ったアカウントが10個くらいあるWebサイトを作ったのですが、一個一個動作確認するのは面倒臭くて…。それ、curlコマンドで自動化出来ます。
---

BASIC認証を使って、アカウントが10種類くらいあるWebサイトを作りました。
一応動作確認しておくかとなるわけですが、BASIC認証ってアカウント切り替える度にブラウザのキャッシュを消さないといけなかったりしてとっても面倒臭い。

面倒臭いことはコマンドラインで自動化しよう、ということで、curlコマンドを使ってやってみました。


# curlでBASIC認証付きのページにアクセスする

curlでは、以下のように[`-u`オプション](https://curl.haxx.se/docs/manpage.html#-u)を使うとBASIC認証が掛かったページにアクセス出来ます。

``` shell
$ curl -u 'yourname:password' 'https://example.com'
...
成功するとここにHTMLがざーっと出る
...
```

`yourname`と`password`がユーザ名、パスワードです。


# 失敗したことをシェルスクリプトで検知する

上記のコマンドだと、認証に失敗したとしても終了コードは0になってしまいます。
なので、BASIC認証が動いていなくてもシェルスクリプトで検知出来ません。

[`-f`オプション](https://curl.haxx.se/docs/manpage.html#-f)というのを付けてあげると、HTTPステータスコードが200番台じゃないときは失敗を返すようしてくれます。

``` shell
$ curl -f -u 'yourname:password' 'https://example.com' && echo '成功' || echo '失敗'
...
ここにHTMLがざーっと出る
...

成功
```

これで、成功とか失敗とか言ってくれるようになりました。


# curlの出力を消す

成功/失敗を出力出来るようになったので、HTMLの出力はもう不要です。

なので出力を`/dev/null`あたりにリダイレクトするわけですが、これだけだと進捗状況がコンソールに出てしまいます。

``` shell
$ curl -f 'https://example.com' > /dev/null && echo '成功' || echo '失敗'
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1256  100  1256    0     0   2457      0 --:--:-- --:--:-- --:--:--  2453
成功
```

この進捗も出さないようにするために、[`-s`オプション](https://curl.haxx.se/docs/manpage.html#-s)を渡してあげるようにします。

``` shell
$ curl -f -s 'https://example.com' > /dev/null && echo '成功' || echo '失敗'
成功
```

これで静かになりました。


# まとめてテストする

たくさんあるアカウントをまとめてテストするために、まず以下のようなファイルを用意しました。名前は適当に`passwords.txt`とか。

``` shell
yourname:password
hoge:fuga
foo:bar
nosuch:user
```

これを、以下のようなスクリプトで読み取って上から順にテストします。

``` bash
for x in $(cat ./passwords.txt); do
    printf '%s ' "$x"
    curl -sfu "$x" "https://example.com?$(date '+%s')" > /dev/null && echo '[OK]' || echo '[FAIL]'
done
```

クエリに現在の日時（`date '%s'`ってやつ）を渡していますが、これはサーバ側のキャッシュを無効化するための措置です。
連続してBASIC認証を要求すると、どうも前回の認証結果がキャッシュされてしまう場合がある（？）ようだったので、このようにしています。

実行すると、以下のような感じになります。

``` shell
$ sh ./さっきのスクリプト.sh
yourname:password [OK]
hoge:fuga [OK]
foo:bar [OK]
nosuch:user [FAIL]
```

最後の`nosuch:user`だけアカウントが無かった場合のイメージ。

これで、大量のアカウントでも簡単に動作確認出来るようになりました。
BASIC認証で大量のアカウント作りたくない気もしますが、まあそれはそれということで…。
