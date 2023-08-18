---
title: pythonのgeventとやらでwebsocket
pubtime: 2014-05-02T20:35:00+09:00
tags: [Web, Python, gevent, ライブラリの紹介]
description: pythonのgeventというライブラリを使って、websocketを使ったリアルタイム通信を実装してみました。
---

webでチャットがしたい。出来ればリアルタイムにやりたい。面倒なのは嫌だ。
調べてみたら結構楽だった。

使ったのは[**gevent**](https://pypi.python.org/pypi/gevent)というライブラリ。
ネットワークプログラミングのためのライブラリらしいです。wsgi対応みたいなので、多分公開するのも簡単。試してないけど。

で、こいつには[**gevent-websocket**](https://pypi.python.org/pypi/gevent-websocket/)というライブラリだかなんだかがあるようで、ただしくはそっちを使いました。
まあどちらも入れなきゃいけないようなので、適当に。

サーバーのソースがこんな感じ。
``` python
from geventwebsocket.handler import WebSocketHandler
from gevent import pywsgi


ws_list = set()

def chat_handle(environ, start_response):
    ws = environ['wsgi.websocket']
    ws_list.add(ws)

    print 'enter:', len(ws_list), environ['REMOTE_ADDR'], environ['REMOTE_PORT']

    while True:
        msg = ws.receive()
        if msg is None:
            break

        remove = set()
        for s in ws_list:
            try:
                s.send(msg)
            except Exception:
                remove.add(s)

        for s in remove:
            ws_list.remove(s)

    print 'exit:', environ['REMOTE_ADDR'], environ['REMOTE_PORT']
    ws_list.remove(ws)


def myapp(environ, start_response):  
    path = environ['PATH_INFO']
    if path == '/': 
        start_response('200 OK', [('Content-Type', 'text/html')])  
        return open('index.html').read()
    elif path == '/chat':  
        return chat_handle(environ, start_response)
    else:
        start_response('404 Not Found.', [('Content-Type', 'text/plain')])  
        return 'not found'


if __name__ == '__main__':
    server = pywsgi.WSGIServer(('localhost', 8080), myapp, handler_class=WebSocketHandler)
    server.serve_forever()
```
かなりシンプル。
大事なのは渡されたenvironに入ってる**wsgi.websocket**を読み書きしてるだけ。

で、HTML。サーバーと同じディレクトリに置いてください。
``` html
<!DOCTYPE html>

<html>
    <head>
        <script>
            function init() {
                ws = new WebSocket('ws://localhost:8080/chat');
                ws.onmessage = function(e) {
                    document.getElementById('holder').innerHTML += '<p>' + e.data + '</p>\n';
                };
                document.getElementById('send').onclick = function send(){
                    ws.send(document.getElementById('message').value);
                    document.getElementById('message').value = ''
                };
            }
        </script>
        <style>
            #sender {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                border-top: 1px solid black;
            }
        </style>
    </head>

    <body onload="init();">
        <div id="holder"></div>
        <div id="sender">
            <input type="text" id="message" size=80 value="text">
            <button id="send">send</button>
        </div>
    </body>
</html>
```
なんかかなり適当なコードだけど、気にしないで。

サーバー立ち上げて、**localhost:8080**にアクセスしてみてください。チャット出来るはず。
簡単だよねー。素敵。

---

参考:
- [WebSocketsでチャットを作ってみる！ &mdash; PythonMatrixJp](http://python.matrix.jp/pages/web/chat_sample.html)
- [geventでWebSocketを使ってみる - へきょのーと](http://d.hatena.ne.jp/hekyou/20120712/p1)
