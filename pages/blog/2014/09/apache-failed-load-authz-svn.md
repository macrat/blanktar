---
title: apacheでmod_authz_svnを読み込もうとしたら失敗した
pubtime: 2014-09-01T15:01:00+09:00
amp: hybrid
tags: [Apache, Subversion, svn, authz]
description: "apacheでmod_authz_svgモジュールを読み込む際に発生した「undefined symbol: dav_svn_get_repos_path」という感じのエラーへの対処方法です。"
---

arch linux上のapacheでsubversionを動かして色々遊んでいたら、
```
# systemctl start httpd
Job for httpd.service failed. See 'systemctl status httpd.service' and 'journalctl -xn' for details.
```
なんて言われた。

言われたとおりにステータスをみてみる。
```
# systemctl status httpd
* httpd.service - Apache Web Server
   Loaded: loaded (/usr/lib/systemd/system/httpd.service; disabled)
   Active: failed (Result: exit-code) since Mon 2014-09-01 14:35:56 JST; 13min ago
  Process: 1113 ExecStop=/usr/bin/apachectl graceful-stop (code=exited, status=1/FAILURE)
  Process: 1120 ExecStart=/usr/bin/apachectl start (code=exited, status=1/FAILURE)
 Main PID: 1023 (code=exited, status=0/SUCCESS)

Sep 01 14:35:56 localhost apachectl[1120]: httpd: Syntax error on line 177 of /etc/httpd/conf/httpd.conf: Cannot load modules/mod_authz_svn.so into server: /etc/httpd/modules/mod_authz_svn.so: undefined symbol: dav_svn_get_repos_path
Sep 01 14:35:56 localhost systemd[1]: httpd.service: control process exited, code=exited status=1
Sep 01 14:35:56 localhost systemd[1]: Failed to start Apache Web Server.
Sep 01 14:35:56 localhost systemd[1]: Unit httpd.service entered failed state.
```
`undefined symbol`・・・？ バグか・・・？

で、設定ファイルを見直してみる。
書き足したのは以下の部分。
``` apache
LoadModule authz_svn_module modules/mod_authz_svn.so
LoadModule dav_svn_module modules/mod_dav_svn.so
```
とくに問題は無いように見える。
ググってもとくに情報は見つからない。うーん？

ふと思いつきで、上下逆にしてみた。
``` apache
LoadModule dav_svn_module modules/mod_dav_svn.so
LoadModule authz_svn_module modules/mod_authz_svn.so
```
こんな感じ。ほんとに上下入れ替えただけ。
そしたら動いた。

エラーで言っていた`dav_svn_get_repos_path`ってのは**mod_dav_svn.so**の中で定義されてるんでしょうね、きっと。
モジュールを読み込むときは順番にも気を遣う必要があるようです。
面倒だけど、まあしょうがないのかな。依存関係みてると起動遅くなりそうだし。
