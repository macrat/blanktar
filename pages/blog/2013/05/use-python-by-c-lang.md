---
title: pythonのモジュールをC言語から使う
pubtime: 2013-05-07T23:48:00+09:00
amp: hybrid
tags: [Python, C言語, モジュール, Python/C]
description: Pythonで書かれたモジュールをPython/C APIを使ってC言語から呼び出す方法を試してみました。
---

pythonで書かれたモジュールをC言語から使うってのを試してみた話。

まあ、つまり、[前に書いたpython/C API](/blog/2013/01/use-c-library-by-python)の逆のことね。
正直使いどころはちょっとわからないけれど、まあいいじゃない。

# 準備する
**Python.h**ってのをインクルードする必要があるので、その辺を準備します。
ていっても、pythonがインストールされてる環境ならすでに入っているはず。

インクルードパスにpythonがインストールされているディレクトリにある**include**ってパスを追加。
それと、**libs/python27.lib**ってファイルを一緒にコンパイルしてやります。
環境/バージョンによってファイル名違うかもだけど、適当に。

windows / Visual C++のclコマンド を使う場合は
``` shell
$ cl *.c /I%PYTHON_DIR%¥include %PYTHON_DIR%¥libs¥python27.lib
```
みたいな感じで。

勿論、`%PYTHON_DIR%`ってやつはpythonのインストールディレクトリに置き換えてください。

# 動かしてみる
``` c
#include <Python.h>

int main()
{
	Py_Initialize();

	PyRun_SimpleString("print 'hello, world!'");

	Py_Finalize();
	return 0;
}
```
こうすると、
``` shell
$ python -c "print 'hello, world!'"
```
ってしたのと同じになります。

# pythonのコードをインポートして、関数を実行
いよいよ本命、pythonで書いたモジュールを使ってみます。
エラー処理とか省いて書いてるので、そのへんは適当に追加してね。

``` c
#include <stdio.h>
#include <Python.h>

int main()
{
	PyObject *pModule, *pTmp;
	char *sTmp;

	Py_Initialize();

	/* モジュールをimport */
	pModule = PyImport_ImportModule("script");

	/* pythonで言う pTmp = getattr(pModule, 'func')() みたいな。 */
	pTmp = PyObject_CallMethod(pModule, "func", NULL);

	/* PyObjectをC言語の型に変換 */
	PyArg_Parse(pTmp, "s", &sTmp)

	printf("%s¥n", sTmp);

	Py_Finalize();
	return 0;
}
```
こんな感じ。

python側のコードは
``` python
def func():
print 'this printed by python'
return 'and, this printed by C'
```
みたいにしといてください。

コンパイルして実行してみると、pythonに書いた2つの文が両方表示されるはず。

参考： [超高レベルレイヤ - Python 2.7ja1 documentation](http://docs.python.jp/2/c-api/veryhigh.html)
