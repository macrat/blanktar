---
title: cmakeにThe current CMakeCache.txt directory云々とかってエラー吐かれた。
pubtime: 2015-08-06T00:34:00+09:00
tags: []
description: cmakeを使っているプロジェクトの場所を移動して、移動後に再コンパイルしようとすると失敗する問題への対処方法です。
---

cmake使って一度コンパイルしたディレクトリを移動して、それからもう一度cmakeやろうとすると

```
$ cmake .
CMake Error: The current CMakeCache.txt directory /path/to/new/CMakeCache.txt is different than the directory /path/to/old where CMakeCache.txt was created. This may result in binaries being created in the wrong place. If you are not sure, reedit the CMakeCache.txt
```

こんな感じのエラーが出るようです。`/path/to/old`が移動前のディレクトリ、`/path/to/new/`が移動後のディレクトリですね。

ぐぐったんですが全く分らなかったので、思い切って消してみました。

```
$ rm CMakeCache.txt
```

えい。

そしたら何か動きました。
キャッシュはその名の通りキャッシュだったようです。
もちろんこれで必ず動くのかどうか分りませんので、自己責任で。重要なプロジェクトならきちんとバックアップ取ってから試してみてください。
