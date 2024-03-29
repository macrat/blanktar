---
title: pythonを使ったxml-rpcが簡単すぎてびっくりした話。
pubtime: 2013-09-22T00:39:00+09:00
tags: [Python, 標準ライブラリ]
description: Pythonの標準ライブラリを使ってXML-RPCを実装してみたのですが、もの凄く手軽に実装出来ました。これを使うと、他のホストのPythonコードを手元のモジュールと同じように扱えます。
---

タイトルが長くてびっくり。
なんてのはどうでもよくて。

pythonの標準ライブラリは例によって凄まじいもので、なんと**遠隔手続き呼び出し**とかいう教科書にしか出てこなさそうなものまでサポートしています。びっくり。
いやごめん嘘、SOAPとか、twitterクライアントで使ってるアレとか同じです。

で、今回使ってみるプロトコルは[XML-RPC](http://ja.wikipedia.org/wiki/XML-RPC)ってやつ。
その名の通りXMLをベースとしたプロトコルで、通信にはhttpを使うそうです。
使うそうなのですが、この記事では**xmlとか全く出てきません**。びっくり。

さて御託はいい、使ってみようじゃないか。
まずはサーバーサイドから。
``` python
try:
    import SimpleXMLRPCServer as xmlrpc_server  # python2.xはこっち。
except ImportError:
    import xmlrpc.server as xmlrpc_server  # python3.xならこっち。

def Hello():
    ''' 外部に公開するための関数。
    なんと普通の関数である。びっくり。
    '''
    return 'Hello World.'

def Add(x, y):
    return x + y

server = xmlrpc_server.SimpleXMLRPCServer(('127.0.0.1', 8080))  # サーバークラスを用意。引数で渡してるの値はそのままSocketServer.TCPServerに渡されるらしい。

server.register_function(Hello)  # 関数を外部に公開する。
server.register_function(Add)

server.register_introspection_functions()  # メソッドのリストとかヘルプとかを取得する関数を公開。

server.serve_forever()
```
簡単。びっくり。

そしてクライアントサイド。
出力が分かりやすいようにこちらはインタープリター的に。
``` python
>>> try:
... 	import xmlrpclib as xmlrpc_client  # python2.xはこっち。
... except ImportError:
... 	import xmlrpc.client as xmlrpc_client  # python3.xならこっち。
...

>>> client = xmlrpc_client.ServerProxy('http://127.0.0.1:8080')  # サーバーに接続。

>>> print client.system.listMethods()  # サーバーが対応している関数の一覧を取得する。
['Add', 'Hello', 'system.listMethods', 'system.methodHelp', 'system.methodSignature']

>>> print client.system.methodHelp('Hello')
外部に公開するための関数。
なんと普通の関数である。びっくり。

>>> print client.Hello()
Hello World.

>>> print client.Add(2, 3)
5
```
こんな感じで。
なんと普通のモジュールのように扱えるようです。すごいねー。

詳細はPython 2.7ja1 documentationの[xmlrpclib](http://docs.python.jp/2/library/xmlrpclib.html)、[SimpleXMLRPCServer](http://docs.python.jp/2/library/simplexmlrpcserver.html)あたりをどうぞ。
