---
title: uwsgiのemperorを他のバージョンのpythonで。
pubtime: 2015-07-25T15:28:00+09:00
amp: hybrid
tags: [uWSGI, emperor, Python]
description: uWSGIのemperorを使用してpythonのWebサービスを実行するときに、Pythonのバージョンを明示的に指定する方法です。
---

apacheのバージョン上げたら色々トラブりまして、せっかくの機会だということで勢いでnginxに移行しました。
速度測ってみたら頑張ってチューニングしたapacheととりあえずやってみました的なnginxが大体互角だった。かなしい。

というのはともかくとして、以降に伴って検索ページやら拍手ページやらのcgi部分が死にまして。
ここら辺python2で書いてあったせいでuwsgiで実行するのに苦戦しました。

emperorとかいう機能を使うと`/etc/uwsgi.d/`にiniファイル置いておくといい感じにやってくれるので嬉しいのですが、悲しいことに私の環境ではpython3が標準になっていまして。
`PYTHON_TARGETS`でも変えればいいのだろうけれど、そんな仰々しいことしたくないし。

そんな感じで調べていると、**plugin**とかいう項目でpythonのバージョンを指定できる様子。
というわけで言われた通りに
``` toml
plugin = python2.7
```
としてみましたが動かない。

ログを見てみると
```
!!! UNABLE to load uWSGI plugin: /usr/lib64/uwsgi/python2.7_plugin.so: cannot open shared object file: No such file or directory !!!
```
みたいな事が書いてありました。

見てみた。
``` shell
$ ls /usr/lib64/uwsgi/
python27_plugin.so  python33_plugin.so
```
解答そのまんまじゃん。

単純にドットが余計だっただけなようで、
``` toml
plugin = python27
```
こんな感じにしたら動きました。

参考： [Different Python versions under the same uwsgi Emperor? - Server Fault](http://serverfault.com/questions/633437/different-python-versions-under-the-same-uwsgi-emperor)
