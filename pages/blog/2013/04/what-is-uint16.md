---
title: C言語のu_int16とかって何なのよ。
pubtime: 2013-04-28T02:25:00+09:00
modtime: 2024-04-27T23:59:00+09:00
tags: [C言語]
description: C言語のint8やu_int16といった型の意味とサイズ、最大値と最小値のまとめです。
---

Unix向けに書かれたC言語のプログラムで見る`u_int8`や、`u_int16`、`u_int32`って型は何なのか。というお話。
そんな検索ワードで来てくださった方が居たようなので。

`u_int16`とは、`unsigned int`の16ビットを示します。

| 名前                   | 別名                                |    サイズ |                     最小値 |                     最大値 |
|------------------------|-------------------------------------|----------:|---------------------------:|---------------------------:|
| unsigned char          | char / u_int8 / uint8_t             |      8bit |                          0 |                        255 |
| signed char            | int8 / int8_t                       |      8bit |                       -128 |                        127 |
| short int              | short / int16_t                     |     16bit |                    -32,768 |                     32,767 |
| unsigned short int     | unsigned short / u_int16 / uint16_t |     16bit |                          0 |                     65,535 |
| int                    | signed int                          | 32bit (※) |             -2,147,483,648 |              2,147,483,647 |
| unsigned int           | uint                                | 32bit (※) |                          0 |              4,294,967,295 |
| long int               | int32_t                             |     32bit |             -2,147,483,648 |              2,147,483,647 |
| unsigned long int      | u_int32 / uint32_t                  |     32bit |                          0 |              4,294,967,295 |
| long long int          | int64_t                             |     64bit | -9,223,372,036,854,775,808 |  9,223,372,036,854,775,807 |
| unsigned long long int | u_int64 / uint64_t                  |     64bit |                          0 | 18,446,744,073,709,551,615 |

※  int / unsigned int はOSによってサイズが異なる場合があります。

ちなみに、Windowsだと`__int8`、`__int16`、`__int32`、`__int64`もあります。
さらには`DWORD`（符号なし32ビット）、`WORD`（符号なし16ビット）なども。
同じ型でもいろいろ呼び方があってややこしいですね。

---

参考：
- [Solaris 動的トレースガイド](https://docs.oracle.com/cd/E19253-01/819-0395/chp-typeopexpr-2/index.html)
- [データ型の範囲 - Visual Studio](http://msdn.microsoft.com/ja-jp/library/vstudio/s3f49ktz.aspx)
