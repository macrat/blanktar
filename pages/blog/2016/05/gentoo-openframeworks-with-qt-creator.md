---
title: gentooにopenFrameworksを入れた戦いの記録
pubtime: 2016-05-22T13:22:00+09:00
modtime: 2016-05-27T00:00:00+09:00
tags: [Linux, Gentoo, openFrameworks, 環境構築]
description: gentooにopenFrameworksをインストールする方法です。かなり長い道程でしたが、きちんとプロジェクトをコンパイル出来るところまでは行けました。
---

ここのところちょこちょこいじっている[openFrameworks](http://openframeworks.cc/ja/)がとても楽しいので、デスクトップのgentooにも入れてみることにしました。
公式にはgentooに対応してくれてないっぽいので、がんばる。

# Qt Creatorを入れる
[Qt Creator](https://www.qt.io/ide/)というIDEを使います。
eclipseでも良いような気がしますが、Qt Creatorならportageにあるので幸せです。

ってわけで、入れます。
```
# echo '>=dev-qt/qt-creator-4.0.0 ~amd64' > /etc/portage/package.keywords
# emerge qt-creator
```
最新版が欲しかったのでkeywordsをいじっていますが、そんなことしなくても古いバージョンで良ければ入ります。

コンパイルしている間に次に進みましょう。

# ダウンロードと設置
[ダウンロードページ](http://openframeworks.cc/ja/download/)からopenFrameworksのtarballを落してきます。

伸張して出てきたディレクトリを適当な場所に設置します。
こいつはずっと使うので、邪魔にならない場所に置いてください。
私は`/usr/local/lib/openFrameworks`に設置しました。

# 依存関係をなんとかする
## コンパイルしようとする
展開したディレクトリ以下の`scripts/linux/`にある`compileOF.sh`というやつでopenFrameworksのコンパイルが出来ます。
なので、早速実行してみます。

```
$ cd scripts/linux
$ ./compileOF.sh
HOST_OS=Linux
checking pkg-config libraries:   cairo zlib gstreamer-app-1.0 gstreamer-1.0 gstreamer-video-1.0 gstreamer-base-1.0 libudev freetype2 fontconfig sndfile openal openssl libpulse-simple alsa gl glu glew gtk+-3.0 libmpg123
makefileCommon/config.shared.mk:294: *** couldn't find some pkg-config packages, did you run the latest install_dependencies.sh?.  Stop.
there has been a problem compiling Debug OF library
please report this problem in the forums
```
めっちゃ怒られました。依存関係を満していないようです。

<ins date="2016-05-27">

### 2016-05-27 追記

もしかしたらルート権限がないとコンパイル出来ないかもしれません。

以下のようなエラーが出たら多分そんな感じです。sudoを付けて試してみてください。
```
$ ./compileOF.sh
HOST_OS=Linux
makefileCommon/config.shared.mk:217: *** This package doesn't support your platform, probably you downloaded the wrong package?.  Stop.
there has been a problem compiling Debug OF library
please report this problem in the forums
```

</ins>

## 足りないものを調べる
`checking pkg-config libraries: `以降をコピーして、何が足りないのか調べてみます。
```
$ pkg-config --libs cairo zlib gstreamer-app-1.0 gstreamer-1.0 gstreamer-video-1.0 gstreamer-base-1.0 libudev freetype2 fontconfig sndfile openal openssl libpulse-simple alsa gl glu glew gtk+-3.0 libmpg123
Package openal was not found in the pkg-config search path.
Perhaps you should add the directory containing `openal.pc'
to the PKG_CONFIG_PATH environment variable
No package 'openal' found
Package libpulse-simple was not found in the pkg-config search path.
Perhaps you should add the directory containing `libpulse-simple.pc'
to the PKG_CONFIG_PATH environment variable
No package 'libpulse-simple' found
Package glew was not found in the pkg-config search path.
Perhaps you should add the directory containing `glew.pc'
to the PKG_CONFIG_PATH environment variable
No package 'glew' found
```
色々足りない。
環境によって何が足りないか違うと思うので、必ず実行してみてください。

## 解決する
良い感じに解決してくれるスクリプトが無いので、依存関係は自分で入れます。
うちの環境ではこうなりました。
```
# emerge media-libs/openal pulseaudio glew
```
そんなに難しくはない。アンインストールするとき面倒臭そうだけど。

# emergeは続く
## RtAudioが無い
依存関係をきちんと解決出来ていれば、あとは普通にコンパイル出来るはずです。やってみます。
```
$ ./compileOF.sh
-- 中略 --

/usr/local/lib64/openFrameworks/libs/openFrameworks/sound/ofRtAudioSoundStream.cpp:8:21: fatal error: RtAudio.h: No such file or directory
 #include "RtAudio.h"
           ^
compilation terminated.
makefileCommon/compile.core.mk:239: recipe for target '/usr/local/lib64/openFrameworks/libs/openFrameworksCompiled/lib/linux64/obj/Debug/libs/openFrameworks/sound/ofRtAudioSoundStream.o' failed
make[1]: *** [/usr/local/lib64/openFrameworks/libs/openFrameworksCompiled/lib/linux64/obj/Debug/libs/openFrameworks/sound/ofRtAudioSoundStream.o] Error 1
makefileCommon/compile.core.mk:213: recipe for target 'Debug' failed
make: *** [Debug] Error 2
there has been a problem compiling Debug OF library
please report this problem in the forums
```
できなかった。

[RtAudio](https://www.music.mcgill.ca/~gary/rtaudio/)というライブラリが無いらしいです。粛々と入れます。
```
# echo 'media-libs/rtaudio ~amd64' > /etc/portage/package.keywords
# emerge rtaudio
```

## FreeImageがない
さあ、openFrameworksをコンパイルしましょう。
```
$ ./compileOF.sh
-- 中略 --

/usr/local/lib64/openFrameworks/libs/openFrameworks/graphics/ofImage.cpp:5:23: fatal error: FreeImage.h: No such file or directory
 #include "FreeImage.h"
             ^
compilation terminated.
makefileCommon/compile.core.mk:239: recipe for target '/usr/local/lib64/openFrameworks/libs/openFrameworksCompiled/lib/linux64/obj/Debug/libs/openFrameworks/graphics/ofImage.o' failed
make[1]: *** [/usr/local/lib64/openFrameworks/libs/openFrameworksCompiled/lib/linux64/obj/Debug/libs/openFrameworks/graphics/ofImage.o] Error 1
makefileCommon/compile.core.mk:213: recipe for target 'Debug' failed
make: *** [Debug] Error 2
there has been a problem compiling Debug OF library
please report this problem in the forums
```
できなかった。

今度は[FreeImage](http://freeimage.sourceforge.net/)ですって。はいはい。
```
# emerge freeimage
```

## 出来た
無心になって再びopenFrameworksをコンパイルします。
```
$ ./compileOF.sh
-- 中略 --

HOST_OS=Linux
checking pkg-config libraries:   cairo zlib gstreamer-app-1.0 gstreamer-1.0 gstreamer-video-1.0 gstreamer-base-1.0 libudev freetype2 fontconfig sndfile openal openssl libpulse-simple alsa gl glu glew gtk+-3.0 libmpg123
Done!
```
出来た。やっと！

ついでにプロジェクトジェネレーターというやつもコンパイルしておきましょう。
こいつがあると、新しいプロジェクトを作るのが楽ちんになります。
```
$ ./compilePG.sh
```
すんなり行く。しあわせ。

# コンパイル出来るか確認する。
ここまで終わったら、サンプルで遊んでみることにします。

openFrameworksのディレクトリにある`examples/`というディレクトリに沢山のサンプルがあります。
適当なプロジェクトを選んで、makeしてやればコンパイル出来ます。
実行ファイルは`bin/`以下に出来るので、実行して遊んでみてください。

# Qt Creatorの設定をする
openFrameworksのディレクトリの`scripts/qtcreator/install_template.sh`といスクリプトを実行すると、Qt CreatorにopenFrameworksのテンプレートがインストールされます。
```
$ cd scripts/qtcreator
$ ./install_template.sh
```
何も表示されずに一瞬で終了したら成功です。多分。

qtcreatorを実行してみます。
```
$ qtcreator
```

**新しいプロジェクト**を選択して、**openFrameworks**というプロジェクトが追加されていれば成功です。
そこからプロジェクトを作ってopenFrameworksを楽しんでください。

---

いかがでしょうか、インストールには成功しましたでしょうか。
私は失敗しました。
新しいプロジェクトにテンプレートが表示されません。もうだめです。つかれました。IDEなしで生きていきます…。
