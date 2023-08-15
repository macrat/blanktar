---
title: "自作Webアプリをmailto:とかtel:のURLに紐付ける"
pubtime: 2022-01-19T20:08:00+09:00
amp: hybrid
tags: [Web, JavaScript]
description: "gmailなどの一部のWebアプリでは、mailto:やtel:から始まるURLを開くように設定することが出来ます。自分で作ったWebアプリでもこの設定をしたかったのでやってみました。制約はありますが、好きなカスタムスキームを登録出来ます。"
---

Google Chromeでgmailを開くと、アドレスバーの右の方に以下のような `mailto:` アドレスを紐付けるための設定が出て来ます。

![Google Chromeの場合の紐付け設定](/blog/2022/01/register-protocol-handler-dialog.jpg "733x422")

これを設定しておくと、 [mailto:test@example.com](mailto:test@example.com) のようなURLをクリックすると勝手にgmailが立ち上がるようになります。
他のサイトからでも常にgmailを開いてくれるので便利。

とある自作アプリで `tel:` から始まるURLを開くように設定したかったので、この機能の実現方法を調べてみました。

やり方はめちゃくちゃ簡単で、以下のようなスクリプトを仕込むだけで登録出来ます。

``` javascript
navigator.registerProtocolHandler(
    'mailto',  // 登録したいURLスキーム。
    'https://example.com/?url=%s',  // 開かせたいURL。
    'メール',  // プロトコルの名前。現在は削除されていますが互換性用に。
);
```

第1引数が登録したいURLスキームで、 `mailto` や `tel` 、 `webcal` などの[ホワイトリスト](https://developer.mozilla.org/ja/docs/Web/API/Navigator/registerProtocolHandler#permitted_schemes)にある主要なプロトコルか、`web+`から始まる好きなプロトコルを指定出来ます。

第2引数は開かせたいURLで、 `%s` の部分がクリックされたURLに置換されます。
上記の例だと、 `mailto:test@example.com` をクリックすると `https://example.com/?url=mailto:test@example.com` が開きます。
URLはHTTPSである必要があるようですが、 `localhost` であれば登録出来たので実験のために証明書を用意する必要は無さそうです。

第3引数は現在は削除されているようですが、互換性のために設定しておいたほうが良さそうです。プロトコルの内容を説明する文字列のようです。

上記を実行すると、gmailの例と全く同じようなUIでハンドラの登録が出来ます。


## 余談: ハンドラの登録を消す方法

デバッグのためにGoogle Chromeで一度設定した紐付けを消したい場合は、以下の手順で削除出来ます。同じ画面でデフォルトのサイトの変更も可能みたいです。

1. Chromeの設定画面を開く

2. サイドバーから「プライバシーとセキュリティ」を開く

3. 「サイトの設定」を開く

4. 「権限」欄の中にある「その他の権限」を開く

5. 「プロトコルハンドラ」を開く

6. 消したいハンドラの右の点3つのアイコンをクリックして「削除」を選ぶ

---

参考:
[Navigator.registerProtocolHandler() - Web API | MDN](https://developer.mozilla.org/ja/docs/Web/API/Navigator/registerProtocolHandler)
