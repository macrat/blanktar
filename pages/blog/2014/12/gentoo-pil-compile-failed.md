---
title: gentooでPILを更新しようとしたらfterrors.hが見つからないって言われた
pubtime: 2014-12-13T11:30:00+09:00
tags: [Gentoo, Python, PIL]
description: gentooにPILを入れる際に、`freetype/fterrors.h`が見つからないというエラーが出る場合の対処方法です。
---

gentooのサーバに入れた**PIL**を更新しようとしたら、こんな感じのエラーが出ました。
```
x86_64-pc-linux-gnu-gcc -march=native -O2 -s -pipe -fPIC -I/usr/include/freetype2 -IlibImaging -I/usr/include -I/usr/include/python2.7 -c _imagingft.c -o /var/tmp/portage/dev-python/imaging-1.1.7-r2/work/Imaging-1.1.7-python2_7/temp.linux-x86_64-2.7/_imagingft.o
_imagingft.c:73:31: fatal error: freetype/fterrors.h: No such file or directory
 #include <freetype/fterrors.h>
```
`freetype/fterrors.h`とやらが見つからないらしい。

調べてみたら、freetype2しか入ってない環境でそういうことが起こるらしい。
わざわざ2じゃないほう入れなくってもfreetype2のヘッダーを見に行かせちゃっていいみたい。

というわけで
```
# cd /usr/include/
# ln -s freetype2 freetype
```
こうしてみた。
コンパイルできた。
めでたしめでたし。

参考：[software installation - PIL install in Ubuntu 14.04.1 LTS - Ask Ubuntu](http://askubuntu.com/questions/507459/pil-install-in-ubuntu-14-04-1-lts)
