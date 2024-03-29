---
title: CUDA使って九九の計算をやってみた
pubtime: 2015-11-12T14:38:00+09:00
tags: [C言語, CUDA]
description: C言語/CUDAを使う練習として、GPUで九九の計算をしてみました。
---

ふと思い立って何の脈絡もなくCUDAに挑戦してみました。やることがないので、九九の表を作ってみました。

セットアップは適当に。わたしの環境には何かすでに入ってました。
gentooでしたら**dev-util/nvidia-cuda-toolkit**あたりを入れたら良いのではないかと思います。

*この記事はとりあえず知識の整理のために書きましたが、よく分っていない感じが漂っています。*
ページ下部の参考ページをご覧になることをお勧めします。

で、書いたコードがこちら。
``` cpp
#include <stdio.h>

#define HEIGHT 9
#define WIDTH 9


// この関数がGPU上で実行されるやつ。
__global__ void kernel(int* target){
    // blockIdx.x:  ブロックのID
    // blockDim.x:  ブロック内で走っているスレッドの数
    // threadIdx.x:  スレッドのID

    // ブロックとスレッドの意味については後述。

    target[blockIdx.x*blockDim.x + threadIdx.x] = (blockIdx.x + 1) * (threadIdx.x + 1);
}

// こっちはごく普通にCPU上で実行される。
int main(){
    int array[HEIGHT*WIDTH];  // CPUで扱うためのメインメモリ上の配列。
    int* device_array;  // 計算用に使うGPU上のメモリのポインタ。

    cudaMalloc((void**)&device_array, sizeof(int) * HEIGHT*WIDTH);  // GPU上にメモリを確保する。

    kernel<<<HEIGHT, WIDTH>>>(device_array);  // 計算を実行する。HEIGHTとWIDTHについては後述。

    cudaMemcpy(array, device_array, sizeof(int) * HEIGHT*WIDTH, cudaMemcpyDeviceToHost);  // 計算しおわったデータを貰ってくる。
    cudaFree(device_array);  // GPUのメモリでも開放しなきゃいけないのは一緒。

    // これはただの表示。
    for(int y=0; y<HEIGHT; y++){
        for(int x=0; x<WIDTH; x++){
            printf("%d\t", array[y*WIDTH + x]);
        }
        printf("\n");
    }

    return 0;
}
```
なんとなくこんな感じです。
**nvcc**とかいうCUDA用のコンパイラでコンパイルするとさらっと実行出来ます。楽ちんで素敵。

ちょっと分かりづらいのが、kernelって関数を実行するときにテンプレートか何かのように渡している`<<<HEIGHT, WIDTH>>>`ってやつ。
これでスレッドを実行するブロックの数(=HEIGHT)とスレッドの数(=WIDTH)を指定しています。
つまり、実行されるスレッド数 = HEIGHT * WIDTH ということ。

GPU内部の各コアはマルチプロセッサという単位で構成されているそうなのですが、ここで言うブロックというやつがこのマルチプロセッサに当たるようです。
利用者側から見てみると、複数のスレッドの塊がブロック、ということですね。

単純に分りやすくコードを書くためのものではなく、物理的な構造に即しているものなので使い方に注意が必要そうです。決してこのサンプルコードのように九九の縦横を表わすのになんか使っちゃいけません。

`kernel`関数の中で`threadIdx`やら`blockIdx`やらの変数を使っていますが、このブロックやらスレッドやらというのはマルチプロセッサやらその中で走るスレッドやらを指す、ということになります。
単純に多次元配列みたいなものと考えても良いのかもしれません？

とりあえず試すだけならお手軽な感じで素敵です。実用的に使おうとすると大掛りになってしまいそうですが…。

---

参考：
- [CUDA 文法 2 - CUDA Information Site](http://gpu.fixstars.com/index.php/CUDA_%E6%96%87%E6%B3%95_2)
- [第４回　実際にCUDAを使ってみる	| G-DEP](http://www.gdep.jp/page/view/251)
