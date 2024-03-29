---
title: cuda(nvcc)でpythonのモジュールを作ってみた
pubtime: 2015-11-18T00:06:00+09:00
tags: [CUDA, C言語, Python, Python/C]
description: C言語を使って、CUDAを扱うことができるPythonモジュールを自作してみました。この記事ではサンプルコードとして、gpuの数を数えるモジュールを作っています。
---

ここのところcudaが楽しくてしょうがないのですが、でもC言語で高いレイヤーの処理はやりたくないですよね。画像をCで触るとか、考えたくもない。
そんなわけでふつう使うのはpycudaあたりだと思うのですが、あえてPython/C APIでモジュールを作ってみることにしました。

とりあえずソースを書きます。
``` cpp
#include <python3.4/Python.h>  // 環境によってはバージョンが違ったり、<python.h>だけで良かったりするかも。


static PyObject* tea_device_count(PyObject *self){
    int n;
    cudaGetDeviceCount(&n);
    return PyLong_FromLong(n);
}


static PyMethodDef TeaMethods[] = {
    {"device_count", (PyCFunction)tea_device_count, METH_NOARGS, "get device count."},
    {NULL, NULL, 0, NULL}
};


static struct PyModuleDef teamodule = {
    PyModuleDef_HEAD_INIT,
    "tea",
    "this is tea\n",
    -1,
    TeaMethods
};


PyMODINIT_FUNC PyInit_tea(){
    return PyModule_Create(&teamodule);
}
```
こんな感じ。`tea`ってモジュールに、`device_count`ってGPUの数を数える関数が一つあるだけです。

コンパイルするときはこんな。
``` bash
$ nvcc -shared -Xcompiler -fPIC tea.cu -o tea.so
```
`-fPIC`ってやつが`-Xcompiler`の前に来るとエラーになるので要注意です。あとは普通に？

使い方は完全に普通のpythonモジュールと同じで、以下のような感じになります。
``` python
>>> import tea
>>> tea.device_count()
1
```
お使いのGPUの数が表示されると思います。2とか3とか出たらリッチな感じですね。

計算などはまだ試していませんが、まあここまで出来て出来ないことはないかと。
素直にpycudaを使えって感じもしますが、これはこれで悪くない気がします。

---

参考：
- [1. C や C++ による Python の拡張 &mdash; Python 3.3.6 ドキュメント](http://docs.python.jp/3.3/extending/extending.html)
- [3. distutils による C および C++ 拡張モジュールのビルド &mdash; Python 2.7ja1 documentation](http://docs.python.jp/2/extending/building.html)
- [c++ - NVCC, strange interaction with -Xcompiler - Stack Overflow](http://stackoverflow.com/questions/26674885/nvcc-strange-interaction-with-xcompiler)
- [NVIDIA CUDA Library: Device Management](http://developer.download.nvidia.com/compute/cuda/4_1/rel/toolkit/docs/online/group__CUDART__DEVICE.html)
