---
title: dev-java/sun-jmsをemergeしようとしたらjms-1_1-fr-apidocs.zipが無いとか言われる
pubtime: 2018-12-09T14:58+0900
tags: [gentoo, portage, emerge, sun-jms, distdir, distfiles]
---

gentooで*sun-jms*が必要になったので、emergeしてみたら何かエラーが出ました。以下のようなもの。

```
$ emerge dev-java/sun-jms
~~略~~

 * Fetch failed for 'dev-java/sun-jms-1.1-r2', Log file:
 *  '/var/tmp/portage/dev-java/sun-jms-1.1-r2/temp/build.log'
 *
 *  Due to license restrictions, we cannot fetch the
 *  distributables automagically.
 *
 *  1. Visit http://download.oracle.com/otndocs/jcp/7542-jms-1.1-fr-doc-oth-JSpec/
 *  2. Accept the License Agreement
 *  3. Download jms-1_1-fr-apidocs.zip
 *  4. Move the file to /var/tmp/portage/dev-java/sun-jms-1.1-r2/distdir
 *
```

言われた通りにzipファイルをダウンロードしてきて指示されたディレクトリに入れてみたのですが、何度か試しても同じエラーが出て上手くいかず。
どうも、portageが起動する度に`/var/tmp/portage/dev-java/sun-jms-1.1-r2/`以下が空になっている様子。ダメじゃん。

試しに`emerge -pv`してみたところ、以下のようなメッセージが出ました。

```
$ emerge -pv dev-java/sun-jms
~~略~~

Fetch instructions for dev-java/sun-jms-1.1-r2:
 * 
 *  Due to license restrictions, we cannot fetch the
 *  distributables automagically.
 * 
 *  1. Visit http://download.oracle.com/otndocs/jcp/7542-jms-1.1-fr-doc-oth-JSpec/
 *  2. Accept the License Agreement
 *  3. Download jms-1_1-fr-apidocs.zip
 *  4. Move the file to /var/tmp/tmp13f70a1f/portage/dev-java/sun-jms-1.1-r2/distdir
 *
```

一時ディレクトリになってるし、しかも実行する度にパス変わるし。

調べてみた結果、portageはデフォルトでは[DISTDIR](https://wiki.gentoo.org/wiki/DISTDIR/ja)で設定されたパスにソースコードのアーカイブを落すそうです。とくに設定を変えていなければ`/usr/portage/distfiles`になっているらしい。
ここに**jms-1_1-fr-apidocs.zip**を入れてみたところ、何事もなくインストール出来ました。めでたしめでたし。
