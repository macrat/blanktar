---
title: macのpandasだってHDF5を使いたい
pubtime: 2015-12-21T16:58:00+09:00
tags: [Mac, Python, Pandas, データ分析]
description: Pythonのpandasで使うためのHDFライブラリを、Mac OSにインストールするための方法です。
---

最近**pandas**が楽しいです。楽しくてしょうがないです。
ばばっとまとめて計算出来るし、何も考えなくてもそれなりに速いし、データの保存も**HDFStore**を使えばがつっと…
がつっと…
``` python
>>> import pandas
>>> pandas.HDFStore('test.h5')
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
  File "/usr/local/lib/python3.5/site-packages/pandas/io/pytables.py", line 385, in __init__
    raise ImportError('HDFStore requires PyTables, "{ex}" problem importing'.format(ex=str(ex)))
ImportError: HDFStore requires PyTables, "No module named 'tables'" problem importing
```
あれぇ…？

エラーを見る限り、**PyTables**とやらが足りないらしい。
PyTablesってのは`tables`って名前でpipに登録されているらしいので、入れる。
```
$ pip install tables
Collecting tables
  Downloading tables-3.2.2.tar.gz (7.0MB)
    100% |████████████████████████████████| 7.0MB 51kB/s 
    Complete output from command python setup.py egg_info:
    /var/folders/hr/7zxpydvd1y71t9pfmjc8vd9m0000gn/T/H5closey6mnsvjy.c:1:1: warning: type specifier missing, defaults to 'int' [-Wimplicit-int]
    main (int argc, char **argv) {
    ^
    /var/folders/hr/7zxpydvd1y71t9pfmjc8vd9m0000gn/T/H5closey6mnsvjy.c:2:5: warning: implicit declaration of function 'H5close' is invalid in C99 [-Wimplicit-function-declaration]
  H5close();
  ^
    2 warnings generated.
    ld: library not found for -lhdf5
    clang: error: linker command failed with exit code 1 (use -v to see invocation)
    * Using Python 3.5.0 (default, Sep 14 2015, 02:37:27)
    * USE_PKGCONFIG: True
    .. ERROR:: Could not find a local HDF5 installation.
       You may need to explicitly state where your local HDF5 headers and
       library can be found by setting the ``HDF5_DIR`` environment
       variable or by using the ``--hdf5`` command-line option.
    
    ----------------------------------------
Command "python setup.py egg_info" failed with error code 1 in /private/var/folders/hr/7zxpydvd1y71t9pfmjc8vd9m0000gn/T/pip-build-8jsswtkr/tables
```
…あれぇ？

hdf5が見つからないらしい。しかたがないので**homebrew**で入れる。
``` bash
$ brew tap homebrew/science
$ brew install hdf5
```

無事HDF5が入ったら、再挑戦。
``` bash
$ pip install tables
```
今度こそ入るはず。

試す。
``` python
>>> pandas.HDFStore('test.h5')
<class 'pandas.io.pytables.HDFStore'>
File path: test.h5
Empty
```
いけた。

っていうことを試行錯誤しながら頑張ってやったのですが、[公式のリポジトリ](https://github.com/PyTables/PyTables)のREADMEに全部書いてありました。
公式を読もうな。な。
