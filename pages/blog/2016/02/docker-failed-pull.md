---
title: dockerで遊ぼうと思ったらなんかpull出来なかった。
pubtime: 2016-02-21T20:55:00+09:00
tags: [Docker]
description: docker pullしようとしたら「Driver devicemapper failed to create image rootfs」という感じのエラーが出たので、それに対応した時のメモです。
---

TensorFlow使って何かしてみようかと思ったのですが、環境の準備が面倒臭かったのでdockerを使うことにしました。
使うことにしたのは良いのですが、これはこれで変なエラーが出る。
``` bash
$ sudo docker pull tensorflow/tensorflow
latest: Pulling from tensorflow/tensorflow
f15ce52fc004: Download complete 
f15ce52fc004: Error downloading dependent layers 
a4c5be5b6e59: Download complete 
8693db7e8a00: Download complete 
d8756350b401: Download complete 
a45e71c8e07a: Downloading  62.7 MB/117.5 MB
a45e71c8e07a: Download complete 
f279406ce390: Downloading 62.71 MB/64.28 MB
f279406ce390: Download complete 
33aaefaf1ef4: Download complete 
61ceb07455d3: Download complete 
522cd5886eb9: Download complete 
b470c94167f1: Download complete 
db3ccc0fd241: Download complete 
8034d5ab3f06: Download complete 
8f7bb1e922ab: Download complete 
8f7bb1e922ab: Error pulling image (latest) from tensorflow/tensorflow, endpoint: https://registry-1.docker.io/v1/, Driver devicemapper failed to create image rootfs f8f7bb1e922ab: Error pulling image (latest) from tensorflow/tensorflow, Driver devicemapper failed to create image rootfs f15ce52fc004a5c3eab9128a78f7c0c2135d4f726bc54f1373120ab3ff291bcc: Error running DeviceCreate (createSnapDevice) dm_task_run failFATA[0043] Error pulling image (latest) from tensorflow/tensorflow, Driver devicemapper failed to create image rootfs f15ce52fc004a5c3eab9128a78f7c0c2135d4f726bc54f1373120ab3ff291bcc: Error running DeviceCreate (createSnapDevice) dm_task_run failed
```
読めない。むずかしい。

archのコミュニティの人曰く、`/var/lib/docker`を消せばなんとかなるらしい。
``` bash
$ sudo service docker stop
$ sudo rm -r /var/lib/docker
$ sudo service docker start
```
こんな感じで。

で、リトライ。
``` bash
$ sudo docker pull tensorflow/tensorflow
latest: Pulling from tensorflow/tensorflow
f15ce52fc004: Pull complete 
c4fae638e7ce: Pull complete 
a4c5be5b6e59: Pull complete 
8693db7e8a00: Pull complete 
d8756350b401: Pull complete 
a45e71c8e07a: Pull complete 
16133a811f85: Pull complete 
f279406ce390: Pull complete 
f8dc0e184935: Pull complete 
33aaefaf1ef4: Pull complete 
61ceb07455d3: Pull complete 
522cd5886eb9: Pull complete 
b470c94167f1: Pull complete 
db3ccc0fd241: Pull complete 
8034d5ab3f06: Pull complete 
8f7bb1e922ab: Pull complete 
Digest: sha256:ce933ea6cb3e3e9b115fd7da7e5d1f4149dee2daed4126ccb606a9d546ae96ff
Status: Downloaded newer image for tensorflow/tensorflow:latest
```
なんか行けたっぽい。

コンテナを置いてあるディレクトリを消すっぽいので、取り扱いには要注意です。
今回は何にも使ってない環境だから良かったけれど、バックアップとかも考えると結構面倒臭い解決策かも。

参考： [[SOLVED] docker will not pull images / Applications &amp; Desktop Environments / Arch Linux Forums](https://bbs.archlinux.org/viewtopic.php?id=179942)
