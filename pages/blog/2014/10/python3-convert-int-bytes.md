---
title: Python3ならintとbytesの変換が楽勝になる
pubtime: 2014-10-05T00:10:00+09:00
modtime: 2024-12-21T00:12:00+09:00
tags: [Python, 言語仕様]
description: Python3.2以降で、bytes型のバイナリデータとint型の整数を相互に変換する方法の紹介です。
image: [/blog/2014/10/python3-convert-int-bytes.png]
faq:
  - question: Pythonのbytesをint型の整数としてパースする方法は？
    answer: <pre><code>int.from_bytes(b'\x80\x00', 'little')</code></pre> のようにするとパースできます。第一引数が対象のバイト列で、第二引数がエンディアンです。
  - question: Pythonのint型の整数をバイナリと見なしてbytesに変換するには？
    answer: <pre><code>(123).to_bytes(4, 'big')</code></pre> のようにすると変換できます。第一引数がバイト数で、第二引数がエンディアンです。
  - question: Pythonでint型の整数を格納するのに必要なバイト数を知る方法は？
    answer: <pre><code>(123).bit_length()</code></pre> とすると必要なビット数が分かるので、これを利用して <pre><code>((123).bit_length() + 7) // 8</code></pre> とすると計算できます。
---

バイト列を整数にする、あるいは整数をバイト列にする。
通信とか暗号とか扱ってると頻繁にやらないといけないわけですが、Pythonだと意外と面倒なんですよね、これが。  
C言語ならキャストしちゃえば一発なんだけどねー。

……なんて思っていました。ついさっきまで。

せめて楽な方法が無いかと探していたら、[公式ドキュメントの「組み込み型」のページ](https://docs.python.org/ja/3/library/stdtypes.html#int.to_bytes)に「整数を表すバイト列を返します。」なんて記述を発見。
なんと標準でそんな機能が入っていたようです。

なお、このメソッドはPython3.2以降でしか使えません。レガシー環境では注意してください。

使い方は以下のような感じになります。

# intからbytesにする

``` python
>>> a = 128
>>> a.to_bytes(2, 'big')  # ビッグエンディアン（1の位が最後尾の1バイトに入る）形式で、2バイトのbytesにする
b'\x00\x80'
>>> a.to_bytes(4, 'little')  # リトリエンディアン（1の位が先頭の1バイトに入る）形式で、4バイトのbytesにする
b'\x80\x00\x00\x00'
>>> a.to_bytes()  # 引数を省略すると1バイトのビッグエンディアンになる
b'\x80'
```
うわぁすごい簡単だ。

ちなみに、指定したバイト数（省略した場合は1バイト）で表せない大きさの場合は[OverflowError](https://docs.python.org/ja/3/library/exceptions.html#OverflowError)が送出されます。

バイト数が分からないときは、必要なビット数を教えてくれる`bit_length`メソッドを使って以下のようにすると良さそうです。

``` python
>>> a = 700

>>> bit_len = a.bit_length()  # 600を表すのに必要なビット数を計算する
>>> bit_len
10

>>> byte_len = (bit_len + 7) // 8  # 10ビットを入れるのに何バイト必要か計算する
>>> byte_len
2

>>> a.to_bytes(byte_len)  # これで変換に使える！
b'\x02\xbc'
```

# bytesからintにする

int -&gt; bytesが出来るのだからもちろんbytes -&gt; intも出来ます。
``` python
>>> int.from_bytes(b'\x00\x80', 'big')
128
>>> int.from_bytes(b'\x80\x00\x00\x00', 'little')
128
```

こっちの場合は引数を省略するとビッグエンディアンで、長さは自動になります。

---

**Q&A**:
- Pythonのbytesをint型の整数としてパースする方法は？  
  → `int.from_bytes(b'\x80\x00', 'little')` のようにするとパースできます。第一引数が対象のバイト列で、第二引数がエンディアンです。

- Pythonのint型の整数をバイナリと見なしてbytesに変換するには？  
  → `(123).to_bytes(4, 'big')` のようにすると変換できます。第一引数がバイト数で、第二引数がエンディアンです。

- Pythonでint型の整数を格納するのに必要なバイト数を知る方法は？  
  → `(123).bit_length()` とすると必要なビット数が分かるので、これを利用して `((123).bit_length() + 7) // 8` とすると計算できます。

<ins>

# 2024-01-25 追記

2024年現在もアクセス数が多いので、最新の環境で動作確認をした上で内容を充実させました。

</ins>
