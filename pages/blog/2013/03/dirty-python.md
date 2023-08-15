---
title: pythonを汚く書く
pubtime: 2013-03-07T00:41:00+09:00
amp: hybrid
tags: [Python, 可読性, ネタ]
description: Pythonを汚く書く10個のアンチパターンまとめです。
---

可読性が高いのは正義だ。
当然、可読性が低いのは悪だ。

という訳で、pythonを汚く書く為の10のtipsです。
いや、ごめん、うそ。ありがちな（そして実際私がよくやる）可読性を下げる要因を並べてみます。

# 1. 名前空間をまとめちゃう
``` python
from PIL.Image import *

for line in open('test.txt'):
    print line
```
普通のコードに見えますよね。

でもさ、**openって関数は組み込み関数なの？ PIL.Image.openなの？**というね。
という訳で、`import *`は読みづらい。

サンプルコードとかでよく見るんだけどね。あれも複数をimportしてると、何の関数だか分からないからやめてほしいよね・・・。

# 2. 改行を省略する
``` python
if A == 'a': print 'A is a!'
```
とか、
``` python
try: func()
except: pass
```
とか。

特に後者はよく見るけどさ。読みづらくない？

# 3. lambdaの乱用
``` python
f = lambda x : int(x==1) or f(x-1)*x
```
何してんだか全然分かんねぇ・・・。

# 4. importが変なところにある
importってさ、実は好きなところに書けるんですよね。
関数の中とか、for文の中とか。

書けるは書けるんだけど、二回目以降同じのが現れても無視される。
だったら素直にトップに書きましょう。仕様変更にも対応しづらくなるからね。

# 5. ワンライナー
``` python
print '\n'.join([', '.join([str(x*y) for y in range(100) if y%2]) for x in range(100) if x%3])
```
・・・なんすか、これ？

# 6. スペースとタブを混合
普通によくある話だし流石にやらないと思うけど。

ちなみに、pythonのコーディング規約である[PEP-8](http://oldriver.org/python/pep-0008j.html)ではスペース四文字を推奨しているよ。
まあ、私はタブ使ってますけど・・・。

# 7. 命名規約が混じってる
命名規約は大事だよね。
と言いつつ私もちゃんとまとまってないのだけれど。

ちなみに、[PEP-8](http://oldriver.org/python/pep-0008j.html)曰く、

<table>
    <tr><td>パッケージ/モジュール</td><td>アンダーバーなしのlowercase</td></tr>
    <tr><td>クラス</td><td>UpperCamel</td></tr>
    <tr><td>例外</td><td>UpperCamel（エラーなら後ろにErrorを付ける）</td></tr>
    <tr><td>関数</td><td>lower_case</td></tr>
    <tr><td>メソッド名/インスタンス変数</td><td>lower_case</td></tr>
    <tr><td>定数</td><td>UPPER_CASE</td></tr>
</table>

らしいっすよ。

# 8. 'と"が混じってる
文字列を`'`でくくる人、結構いるのよね。
`"`のエスケープが必要ないのが楽なんで私も使ってますが。
まあどっちでも良いんだろうけれど、混在させるのだけはやめよう、めんどい。

[PEP-8](http://oldriver.org/python/pep-0008j.html)では`"`使ってますね。

# 9. if文が長い英語みたいになってる
``` python
if A is not B and C is A or B is not A and D is True
```
おい、これは英語か？
見てるうちに何処と何処が繋がってるのか分からなくなってくるので、やめたほうがいい気がします。

# 10. 数字じゃないのに計算してる
``` python
('a' * int(x > 5) + 'b' * x%3) or 'c'
```
みたいな。

驚くべきことにこれが実行できちゃうんだよね、pythonって。
読みづらくてやばいけど、楽だからついやってしまう。
