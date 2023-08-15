---
title: pythonのCryptoでAES暗号を使ってみた
pubtime: 2013-04-26T17:55:00+09:00
amp: hybrid
tags: [Python, 暗号]
description: Pythonの「pycrypto」というライブラリを使ってAES暗号で文字列の暗号化を試してみました。
---

暗号っていいよね。なんかこう、楽しい。
というわけで、pythonで試してみました。

といっても、残念ながら標準ライブラリにはそれっぽいのがない。
hmacとかsslとかはあるんだけどねー。
AESくらいは標準ライブラリに入れといて欲しいよね・・・。ま、仕方がない。
仕方がないので、今回使うのは**pycrypto**っていうライブラリを使わして頂きます。

# インストール
gentooのportageにパッケージがあったので有難く利用。
``` shell
$ sudo emerge pycrypto
```
python2.xでもpython3.xでも**Crypto**って名前のパッケージになります。
小文字じゃないんだね、頭。

gentoo以外を使ってる方はpypiにある[pycryptoのページ](https://pypi.python.org/pypi/pycrypto)あたりからどうぞ。

# 使ってみる
早速AESで遊んでみます。

１つ注意しなきゃいけないのは、AESはブロック暗号だということ。
つまり、鍵長は16バイト、24バイト、32バイトのうちのどれかじゃないといけないし、データも16バイトの倍数じゃなきゃいけない。
めんどくさいけど、まあその分高速・・・なんじゃない？　多分。

``` python
from Crypto.Cipher import AES

key = 'this is a key123'      # 鍵。数字とか入れて文字数を稼がなきゃいけない。
message = 'this is message!'  # 暗号化するデータ。これも16バイトの倍数じゃなきゃいけない。

print 'original:', message

cipher = AES.new(key)  # これで暗号化/復号するためのモノを作成。

data = cipher.encrypt(message)  # 戻り値は暗号化されたデータ。
print 'cipher:', repr(data)     # バイナリなのでそのままprintせずにreprに通してます。

print 'decode:', cipher.decrypt(data)  # こうすると復号されたデータが返ってくる。
```
以上。結構簡単な感じ。

ただ厄介なのは、
``` python
import Crypto

obj = Crypto.Cipher.AES.new(key)
```
みたいな使い方ができないっぽい。
ディレクトリで分けてるみたいね。

必ず
``` python
import Crypto.Cipher.AES
```
とするか、
``` python
from Crypto.Cipher import AES
```
としてください。

---
参考：
[PyCryptoで暗号化する - Pythonメモ](http://yoshi-python.blogspot.jp/2009/10/pycrypto.html)
[pycrypto - Python Package Index](https://pypi.python.org/pypi/pycrypto)
