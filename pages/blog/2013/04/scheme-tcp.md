---
title: scheme（gauche）でTCP通信してみる
pubtime: 2013-04-25T17:33:00+09:00
amp: hybrid
tags: [Lisp, Scheme, Gauche]
description: lisp方言の1つであるScheme（Gauche）を使って、TCP通信の実験をしてみました。
---

しばらく前に試してみたことを今更公開。

schemeでtcp通信をやってみました。
**gauche.net**ってやつを使ってることから分かるとおり、gauche専用です。

# 受信側
``` scheme
(use gauche.net)

(define (handler sock)
  (let ((recv (socket-recv sock 1024)))
    (if (&lt;= (string-length recv) 0)
      (begin
        (display "exit\n")
        (socket-close sock)
        (exit)))
    (display "\"")(display recv)(display "\"")(newline)
    (socket-send sock recv))
  (handler sock))

(define (main args)
  (display "create socket...\n")
  (let ((server-sock (make-server-socket `inet 5000)))
    (display "accept start...\n")
    (let ((sock (socket-accept server-sock)))
      (display "recv start...\n")
      (handler sock))))
```
こんな感じ。
ただのエコーサーバーっすね。

# 送信側
``` scheme
(use gauche.net)

(define (input-line)
  (display "&gt;&gt; ")(flush)
  (let ((input (read-line)))
    (if (eof-object? input)
      (begin (newline)(exit))
      input)))

(define (main args)
  (let ((sock (make-client-socket `inet "127.0.0.1" 5000)))
    (let loop((input (input-line)))
      (socket-send sock input)
      (display (socket-recv sock 1024))(newline)
      (loop (input-line)))))
```
こんなもんで。

プロンプトっぽいのを出して、入力されたのをひたすら送信します。

こうやってみると、やっぱりpythonは手軽でいいな、とか思ってしまうよね。
かんすうこわい。
