---
title: windowsのPILでフォント読み込もうとしたらImportErrorが出るバグの修正パッチ作った。
pubtime: 2013-09-03T20:47:00+09:00
tags: [Python, PIL, 画像処理]
description: windowsのPILでフォントを上手く読み込めないバグがあったので、無理やり修正するパッチを作成してみました。
---

PILで画像に文字を書こうと思ってImageFont.truetypeでフォントを読み込んだら、
```
ImportError: The _imagingft C module is not installed
```
なんて言って怒られた。

聞けばこれはPIL 1.17だけで発生するバグのようで、しかもwindows用の公式インストーラーにしか含まれないもののようです。
んー、何かわからないけれど、めんどい。
古いバージョンをインストールするとか、非公式インストーラーを使うという手もあるようだけれど、めんどい。

という訳で、無理やり修正するパッチを作成しました。
ただし、**もしかしたらすごい危ないかもしれません。**自己責任でどうぞ。

[ダウンロード](/blog/2013/09/ImageFontCorrection.exe)

PILがインストールされているディレクトリ（通常はpythonのディレクトリ`\Lib\site-packages\PIL\`）にダウンロードしたexeファイルをコピーして、そこで実行してください。
それだけで動くようになるはずです。

正常に終了したらパッチのexeファイルは削除して構いませんが、\_imagingft.OLDという名前で作成される<b>バックアップファイルは削除しないで</b>ください。
問題があった時には\_imagingft.OLDを\_imagingft.pydに上書きすれば元に戻ります。

---

参考:
- [Python Imaging Library (PIL) 利用ノート](http://www.geocities.jp/showa_yojyo/note/python-pil.html#importerror-dll-load-failed)
- [blockdiag を WindowsXP で動かす ≪ Stop Making Sense](http://99blues.dyndns.org/blog/2011/01/blockdiag_for_win/#step.5)
