---
title: uwsgiでpython動かそうとしたらunrecognized optionって言われた。
pubtime: 2014-03-07T00:45:00+09:00
tags: [Web, Python, uWSGI]
description: nginxとuwsgiを組み合わせてpythonを動かそうとしたところ、「unrecognized option '--wsgi-file'」というエラーが出たので対処方法を調べました。どうやらプラグインが足りなかったようです。
---

[nginxを試す流れ](/blog/2014/03/nginx-erropage)でuwsgiも試してます。拍手ページと検索ページがpythonだからねー。

引き続きubuntuにuwsgiをインストールして、起動しようとしたら
``` python
$ uwsgi --http 0.0.0.0:8080 --wsgi-file test.py --callable app
uwsgi: unrecognized option '--wsgi-file'
getopt_long() error
```
とか言われた。

うーん、なんだろう。

apt-cacheで検索したら、**uwsgi-plugin-python**なんてものを発見。おや、怪しい。

ヘルプを見ても`--plugin`なんてオプションが。こいつが必要らしい。
というわけでuwsgi-plugin-pythonをインストールして、
``` python
$ uwsgi --http 0.0.0.0:8080 --plugin python --wsgi-file test.py --callable app
```
みたいにしたら無事起動。

`--wsgi-file`よりも前に`--plugin python`が無いといけないっぽいので注意。

<aside>

ちなみに、test.pyの中身は
``` python
from flask import Flask

app = Flask(__name__)

@app.route('/')
def root():
    return 'hello, world!'
```
みたいになってます。

</aside>

参考：
- [便利で超強力なWSGIサーバー uWSGI を使ってみよう - 檜山正幸のキマイラ飼育記](http://d.hatena.ne.jp/m-hiyama/20120312/1331513519)
- [Deploying Python with uWSGI and Nginx on Ubuntu 13.10](http://perlmaven.com/deploying-pyton-with-uwsgi-on-ubuntu-13-10)
