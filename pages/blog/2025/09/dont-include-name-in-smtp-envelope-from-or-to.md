---
title: SMTPでメールを送ろうとしたら「SMTP 555-5.5.2 Syntax error」というエラーが出たときの対処法
description: SMTPでメールを送信しようとしたら、「SMTP 555-5.5.2 Syntax error」というエラーが出ました。エラーメッセージが少し分かりづらいので、原因と対処法をメモしておきます。
pubtime: 2025-09-15T17:20:00+09:00
tags: [curl, メール, SMTP]
---

あるサーバーからcurlでメールを送るスクリプトを書いていたら、「SMTP 555-5.5.2 Syntax error」というエラーでメールを送信できなくなったことがありました。
エラーメッセージが分かりづらくて原因の特定に苦労したのでメモしておきます。

今回は、ざっくりと以下のようなスクリプトでメールを送ろうとしていました。
メールサーバーはGmailで、送信に使ったクライアントはcurlです。

```shell
from='"MySystem" <my-system@example.com>'

curl $server -u "${username}:${password}" --mail-from $from --mail-rcpt $to -T - <<EOS
To: me@example.com
From: ${from}
Subject: Hello

Hello!
EOS
```

これを実行すると、以下のようなエラーが返ってきました。

```text
target@example.com [555-5.5.2 Syntax error, cannot decode response. For more information, go to 5.5.2  https://support.google.com/a/answer/3221692 and review RFC 5321 5.5.2 specifications. x4-00000000000000000000000000000000000000000pgl.108 - gsmtp]
```

[RFC5321](https://www.ietf.org/rfc/rfc5321.txt)によれば、555は「555  MAIL FROM/RCPT TO parameters not recognized or not implemented」という意味のようです。
つまり、送信元か送信先のアドレスに問題がある、ということですね。

今回のスクリプトでは、`--mail-from`オプションで指定するEnvelope Fromアドレスと、メールヘッダーに指定するFromアドレスの両方に、`"送信者名" <送信元アドレス>`の形式を使っていました。
しかし、Envelope Fromの方はメールアドレスだけにしておかないといけないようです。

というわけで、スクリプトを以下のように修正したところ、無事に送信できるようになりました。

```shell
from_name='MySystem'
from_addr='my-system@example.com'

curl $server -u "${username}:${password}" --mail-from $from_addr --mail-rcpt $to -T - <<EOS
To: me@example.com
From: "${from_name}" <${from_addr}>
Subject: Hello

Hello!
EOS
```

同じエラーは `--mail-rcpt` オプションで指定するEnvelope Toでも発生するはずです。
送信元/送信先の名前はメールヘッダーにしか含めてはいけない。覚えておきましょう。
