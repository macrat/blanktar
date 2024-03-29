---
title: pipとhomebrewでmacにPyAudioを入れた。
pubtime: 2016-01-15T14:35:00+09:00
tags: [Mac, Python, 音声処理]
description: Pythonで音を操作するライブラリであるPyAudioを、pipとHomebrewを使ってMac OSにインストールしました。
---

[HTML5でやった音の解析](/blog/2016/01/html5-audio-context)をpythonでもやりたくなって、挑戦してみることにしました。
とりあえず、マイク入力をやってみるべく[PyAudio](https://people.csail.mit.edu/hubert/pyaudio/)を入れてみる。

**pip**で入るっぽいので、普通に入れようとしてみる。
```
$ pip install pyaudio
-- 前略 --
  ----------------------------------------
  Failed building wheel for pyaudio
Failed to build pyaudio
Installing collected packages: pyaudio
  Running setup.py install for pyaudio
    Complete output from command /usr/local/opt/python/bin/python2.7 -c "import setuptools, tokenize;__file__='/private/var/folders/hr/7zxpydvd1y71t9pfmjc8vd9m0000gn/T/pip-build-qflUbY/pyaudio/setup.py';exec(compile(getattr(tokenize, 'open', open)(__file__).read().replace('\r\n', '\n'), __file__, 'exec'))" install --record /var/folders/hr/7zxpydvd1y71t9pfmjc8vd9m0000gn/T/pip-62rzwG-record/install-record.txt --single-version-externally-managed --compile:
    running install
    running build
    running build_py
    running build_ext
    building '_portaudio' extension
    clang -fno-strict-aliasing -fno-common -dynamic -g -O2 -DNDEBUG -g -fwrapv -O3 -Wall -Wstrict-prototypes -DMACOSX=1 -I/usr/local/include -I/usr/local/opt/openssl/include -I/usr/local/opt/sqlite/include -I/usr/local/Cellar/python/2.7.11/Frameworks/Python.framework/Versions/2.7/include/python2.7 -c src/_portaudiomodule.c -o build/temp.macosx-10.10-x86_64-2.7/src/_portaudiomodule.o
    src/_portaudiomodule.c:29:10: fatal error: 'portaudio.h' file not found
    #include "portaudio.h"
       ^
    1 error generated.
    error: command 'clang' failed with exit status 1

    ----------------------------------------
Command "/usr/local/opt/python/bin/python2.7 -c "import setuptools, tokenize;__file__='/private/var/folders/hr/7zxpydvd1y71t9pfmjc8vd9m0000gn/T/pip-build-qflUbY/pyaudio/setup.py';exec(compile(getattr(tokenize, 'open', open)(__file__).read().replace('\r\n', '\n'), __file__, 'exec'))" install --record /var/folders/hr/7zxpydvd1y71t9pfmjc8vd9m0000gn/T/pip-62rzwG-record/install-record.txt --single-version-externally-managed --compile" failed with error code 1 in /private/var/folders/hr/7zxpydvd1y71t9pfmjc8vd9m0000gn/T/pip-build-qflUbY/pyaudio
```
怒られた。[portaudio](http://www.portaudio.com/)とやらが無いらしい。

こっちは**homebrew**で入るっぽいので、入れる。
```
$ brew install portaudio
==> Downloading https://homebrew.bintray.com/bottles/portaudio-19.20140130.yosemite.bottl
######################################################################## 100.0%
==> Pouring portaudio-19.20140130.yosemite.bottle.1.tar.gz
🍺  /usr/local/Cellar/portaudio/19.20140130: 30 files, 459.7K
```
入った。

リトライ。
```
$ pip install pyaudio
Collecting pyaudio
  Using cached PyAudio-0.2.9.tar.gz
Building wheels for collected packages: pyaudio
  Running setup.py bdist_wheel for pyaudio
  Stored in directory: /Users/ena/Library/Caches/pip/wheels/84/09/9e/49441223cb875ab560307172b4835caa143907305d607723c5
Successfully built pyaudio
Installing collected packages: pyaudio
Successfully installed pyaudio-0.2.9
```
できた。

この依存関係解決してくれるんだかくれないんだかよく分からない感じ、なんとかならんのでしょうかね…。
