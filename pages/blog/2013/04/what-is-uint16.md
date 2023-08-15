---
title: C言語のu_int16とかって何なのよ。
pubtime: 2013-04-28T02:25:00+09:00
amp: hybrid
tags: [C言語]
description: C言語のint8とかu_int16とかの意味とサイズ、最大値と最小値のまとめです。
---

unixのヘッダとかで見る`u_int8`とか、`u_int16`、`u_int32`ってやつ。アレは何なのか。というお話。
そんな検索ワードで来てくださった方が居たようなので。

端的に言ってしまえば、`u_int8`は8ビットの`unsigned int`を指します。
つまり`u_int8` = `unsigned char`ってこと。

|名前                  |別名              |サイズ               |最小値                    |最大値                    |
|----------------------|------------------|---------------------|-------------------------:|-------------------------:|
|short int             |int8_t            |16bit                |                   -32,768|                    32,767|
|unsigned short int    |u_int8 / uint8_t  |16bit                |                         0|                    65,535|
|int                   |                  |32bit（とも限らない）|            -2,147,483,648|             2,147,483,647|
|unsigned int          |uint              |32bit（とも限らない）|                         0|             4,294,967,295|
|long int              |int32_t           |32bit                |            -2,147,483,648|             2,147,483,647|
|unsigned long int     |u_int32 / uint32_t|32bit                |                         0|             4,294,967,295|
|long long int         |int64_t           |64bit                |-9,223,372,036,854,775,808| 9,223,372,036,854,775,807|
|unsigned long long int|u_int64 / uint64_t|64bit                |                         0|18,446,744,073,709,551,615|

だいたいこんな感じかな。

他にもVisual Studioだと`__int8`、`__int16`、`__int32`、`__int64`などなど。
ちなみに悪名高き（？）`DWORD`型は符号なしの32ビット。Dobleじゃないただの`WORD`型は符号なしの16ビットだよ。
勝手に型を増やすなよめんどくさい。

---

参考：
- [基本的な決まり - 目指せプログラマー！](http://www5c.biglobe.ne.jp/~ecb/c/01_04.html)
- [データ型の範囲 - Visual Studio](http://msdn.microsoft.com/ja-jp/library/vstudio/s3f49ktz.aspx)
