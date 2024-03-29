---
title: macのautomatorでsshfsとかramfsを自動マウントする
pubtime: 2015-08-19T17:27:00+09:00
tags: [Mac, 環境構築]
description: Mac OSに付属している自動化ツール「automator」を使って、sshfsやramfsなどの特殊なストレージを自動的にマウントする方法です。マウントに限らず、色々なスクリプトを実行出来るはずです。
---

私は基本的にファイルは全て自宅サーバに置いておいて、sshfsでマウントして使っています。ついでに、一時的な作業なんかはramfsを使っています。
これ結構便利なのですが、いちいち手動でマウントすると面倒臭いんですよね。
というわけで、自動化してみました。

なお、この記事ではsshfsやramfsの使い方については扱いません。

とりあえず、**automator**とかいうアプリケーションを起動します。なんか色々作業を自動化してくれるソフトらしいです。
起動すると何を作るか（？）を聞かれるので、`アプリケーション`と答えておきます。

アクションとかいう一覧から「シェルスクリプトを実行」を見つけてダブルクリックします。上のほうに検索窓があるから使うと良いかも。
そうすると画面にエディタ的なものが出てくるので、ここにsshfsやらramfsやらをマウントするコマンドを書きます。
テキストエリアの上のほうに「シェル」という項目があるので、「/bin/sh」を選んでおくと良いかも。/usr/local/bin/bashでは上手く動いてくれませんでした。

完了したら適当な名前を付けて保存して、画面右上の「実行」ってボタンで動作確認をしておきます。
上手くマウント出来ることを確認したら、automatorの仕事はおしまい。ウィンドウを閉じます。

今度は**システム環境設定**を開いて、「ユーザとグループ」（OS Xのバージョンによっては「アカウント」）にある「ログイン項目」のタブを開きます。
下のほうの「+」ボタンをクリックして、先ほど保存したappファイルを探して「追加」します。

これで作業は完了。再起動したら自動でマウントされているはずです。
sshfsのバージョンというか種類によっては回線切断時におかしなことになる場合があるようなので注意。
