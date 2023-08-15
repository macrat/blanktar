---
title: emergeしようとしたらf2pyが起動した
pubtime: 2016-09-26T22:15:00+09:00
amp: hybrid
tags: [Portage, emerge, f2py]
description: gentooのportageで色々試していたところ、突然emergeコマンドを起動してもf2pyのヘルプが表示されるようになってしまいました。この問題への対応方法です。
---

gentooでGPU使ってchainerをやるべくopencv3とかnvidia-cuda-toolkitを入れなおしまくっていたところ、唐突にportageが仕事をしなくなりました。
どうも、f2pyとして起動しているっぽい？

こんな感じの症状。
```
$ emerge
Usage:

1) To construct extension module sources:

      f2py [<options>] <fortran files> [[[only:]||[skip:]] \
                                        <fortran functions> ] \
                                       [: <fortran files> ...]

2) To compile fortran files and build extension modules:

      f2py -c [<options>, <build_flib options>, <extra options>] <fortran files>

3) To generate signature files:

      f2py -h <filename.pyf> ...< same options as in (1) >

Description: This program generates a Python C/API file (<modulename>module.c)
             that contains wrappers for given fortran functions so that they
             can be called from Python. With the -c option the corresponding
             extension modules are built.

Options:

  -- -- -- 中略 -- -- --

Version:     2
numpy Version: 1.11.1
Requires:    Python 2.3 or higher.
License:     NumPy license (see LICENSE.txt in the NumPy source code)
Copyright 1999 - 2011 Pearu Peterson all rights reserved.
http://cens.ioc.ee/projects/f2py2e/
```

よく分からないのですが、とりあえず、以下のようにすれば治るようです。
```
# /usr/lib/python-exec/python3.4/emerge --oneshot portage python-exec
```

emergeを起動出来なくなったら`/usr/lib/python-exec/`以下にあるやつを使えば良い、ということのようです。たぶん。

参考： [Gentoo Forums :: View topic - Problem with emerge / python-exec](https://forums.gentoo.org/viewtopic-t-1006016.html)
