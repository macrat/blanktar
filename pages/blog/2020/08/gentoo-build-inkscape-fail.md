---
title: Gentooへのinkscapeのインストールがundefined referenceで失敗する
pubtime: 2020-08-14T20:31:00+09:00
amp: hybrid
tags: [Gentoo, Portage, Inkscape, gcc]
description: うちのGentoo、結構前からInkscapeのインストールに失敗していたのですが、重い腰を上げて原因の調査をしてみました。ずいぶん前のgccの更新が原因だったみたいで、依存関係の再コンパイルで無事にコンパイル出来るようになりました。
---

結構前からInkscapeのemergeに失敗していたのですが、まああんまり使ってないし良いかという気持ちで放置していました。
最近使う機会がまた増えてきたので、重い腰を上げて原因を調査してみました。


# TL;DR

以下のコマンドで直せました。

``` shell
$ sudo revdep-rebuild --library libstdc++.so.6 -- --exclude gcc
$ sudo emerge inkscape
```


# 症状

inkscapeをemergeしようとすると、以下のような感じでリンクに失敗していました。

```
$ sudo emerge inkscape

〜略〜

[1038/1039] : && /usr/bin/x86_64-pc-linux-gnu-g++  -O2 -pipe -march=core-avx2 -fno-strict-aliasing -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=2 -fstack-protector-strong -Werror=format -Werror=format-security -pthread -fopenmp  -Wl,-O1 -Wl,--as-needed    -rdynamic src/CMakeFiles/inkview.dir/inkview-main.cpp.o  -o bin/inkview  -Wl,-rpath,/var/tmp/portage/media-gfx/inkscape-1.0-r1/work/inkscape-1.0_build/lib64:  lib64/libinkscape_base.so  -lharfbuzz  -lpangocairo-1.0  -lcairo  -lpangoft2-1.0  -lpango-1.0  -lfontconfig  -lfreetype  -lgsl  -lgslcblas  -lm  -Wl,--export-dynamic  -lgmodule-2.0  -pthread  -lsoup-2.4  -lgio-2.0  -lgobject-2.0  -lglib-2.0  -lc  -lgc  -lpoppler  -lpoppler-glib  -lcairo  -ljpeg  -lpng  -lpotrace  -lgtkmm-3.0  -latkmm-1.6  -lgdkmm-3.0  -lgiomm-2.4  -lpangomm-1.4  -lglibmm-2.4  -lcairomm-1.0  -lsigc-2.0  -lgdl-3  -lgtk-3  -lgdk-3  -lpangocairo-1.0  -lpango-1.0  -latk-1.0  -lcairo-gobject  -lcairo  -lgdk_pixbuf-2.0  -lgio-2.0  -lgobject-2.0  -lglib-2.0  -lxslt  -lxml2  -lz  -lsigc-2.0  -lSM  -lICE  -lX11  -lXext && :
FAILED: bin/inkview
: && /usr/bin/x86_64-pc-linux-gnu-g++  -O2 -pipe -march=core-avx2 -fno-strict-aliasing -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=2 -fstack-protector-strong -Werror=format -Werror=format-security -pthread -fopenmp  -Wl,-O1 -Wl,--as-needed    -rdynamic src/CMakeFiles/inkview.dir/inkview-main.cpp.o  -o bin/inkview  -Wl,-rpath,/var/tmp/portage/media-gfx/inkscape-1.0-r1/work/inkscape-1.0_build/lib64:  lib64/libinkscape_base.so  -lharfbuzz  -lpangocairo-1.0  -lcairo  -lpangoft2-1.0  -lpango-1.0  -lfontconfig  -lfreetype  -lgsl  -lgslcblas  -lm  -Wl,--export-dynamic  -lgmodule-2.0  -pthread  -lsoup-2.4  -lgio-2.0  -lgobject-2.0  -lglib-2.0  -lc  -lgc  -lpoppler  -lpoppler-glib  -lcairo  -ljpeg  -lpng  -lpotrace  -lgtkmm-3.0  -latkmm-1.6  -lgdkmm-3.0  -lgiomm-2.4  -lpangomm-1.4  -lglibmm-2.4  -lcairomm-1.0  -lsigc-2.0  -lgdl-3  -lgtk-3  -lgdk-3  -lpangocairo-1.0  -lpango-1.0  -latk-1.0  -lcairo-gobject  -lcairo  -lgdk_pixbuf-2.0  -lgio-2.0  -lgobject-2.0  -lglib-2.0  -lxslt  -lxml2  -lz  -lsigc-2.0  -lSM  -lICE  -lX11  -lXext && :
/usr/lib/gcc/x86_64-pc-linux-gnu/9.3.0/../../../../x86_64-pc-linux-gnu/bin/ld: lib64/libinkscape_base.so: undefined reference to `Cairo::ImageSurface::create_from_png(std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> >)'
/usr/lib/gcc/x86_64-pc-linux-gnu/9.3.0/../../../../x86_64-pc-linux-gnu/bin/ld: lib64/libinkscape_base.so: undefined reference to `Cairo::Context::show_text(std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> > const&)'
collect2: error: ld returned 1 exit status
[1039/1039] : && /usr/bin/x86_64-pc-linux-gnu-g++  -O2 -pipe -march=core-avx2 -fno-strict-aliasing -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=2 -fstack-protector-strong -Werror=format -Werror=format-security -pthread -fopenmp  -Wl,-O1 -Wl,--as-needed    -rdynamic src/CMakeFiles/inkscape.dir/inkscape-main.cpp.o  -o bin/inkscape  -Wl,-rpath,/var/tmp/portage/media-gfx/inkscape-1.0-r1/work/inkscape-1.0_build/lib64:  lib64/libinkscape_base.so  -lharfbuzz  -lpangocairo-1.0  -lcairo  -lpangoft2-1.0  -lpango-1.0  -lfontconfig  -lfreetype  -lgsl  -lgslcblas  -lm  -Wl,--export-dynamic  -lgmodule-2.0  -pthread  -lsoup-2.4  -lgio-2.0  -lgobject-2.0  -lglib-2.0  -lc  -lgc  -lpoppler  -lpoppler-glib  -lcairo  -ljpeg  -lpng  -lpotrace  -lgtkmm-3.0  -latkmm-1.6  -lgdkmm-3.0  -lgiomm-2.4  -lpangomm-1.4  -lglibmm-2.4  -lcairomm-1.0  -lsigc-2.0  -lgdl-3  -lgtk-3  -lgdk-3  -lpangocairo-1.0  -lpango-1.0  -latk-1.0  -lcairo-gobject  -lcairo  -lgdk_pixbuf-2.0  -lgio-2.0  -lgobject-2.0  -lglib-2.0  -lxslt  -lxml2  -lz  -lsigc-2.0  -lSM  -lICE  -lX11  -lXext && :
FAILED: bin/inkscape
: && /usr/bin/x86_64-pc-linux-gnu-g++  -O2 -pipe -march=core-avx2 -fno-strict-aliasing -U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=2 -fstack-protector-strong -Werror=format -Werror=format-security -pthread -fopenmp  -Wl,-O1 -Wl,--as-needed    -rdynamic src/CMakeFiles/inkscape.dir/inkscape-main.cpp.o  -o bin/inkscape  -Wl,-rpath,/var/tmp/portage/media-gfx/inkscape-1.0-r1/work/inkscape-1.0_build/lib64:  lib64/libinkscape_base.so  -lharfbuzz  -lpangocairo-1.0  -lcairo  -lpangoft2-1.0  -lpango-1.0  -lfontconfig  -lfreetype  -lgsl  -lgslcblas  -lm  -Wl,--export-dynamic  -lgmodule-2.0  -pthread  -lsoup-2.4  -lgio-2.0  -lgobject-2.0  -lglib-2.0  -lc  -lgc  -lpoppler  -lpoppler-glib  -lcairo  -ljpeg  -lpng  -lpotrace  -lgtkmm-3.0  -latkmm-1.6  -lgdkmm-3.0  -lgiomm-2.4  -lpangomm-1.4  -lglibmm-2.4  -lcairomm-1.0  -lsigc-2.0  -lgdl-3  -lgtk-3  -lgdk-3  -lpangocairo-1.0  -lpango-1.0  -latk-1.0  -lcairo-gobject  -lcairo  -lgdk_pixbuf-2.0  -lgio-2.0  -lgobject-2.0  -lglib-2.0  -lxslt  -lxml2  -lz  -lsigc-2.0  -lSM  -lICE  -lX11  -lXext && :
/usr/lib/gcc/x86_64-pc-linux-gnu/9.3.0/../../../../x86_64-pc-linux-gnu/bin/ld: lib64/libinkscape_base.so: undefined reference to `Cairo::ImageSurface::create_from_png(std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> >)'
/usr/lib/gcc/x86_64-pc-linux-gnu/9.3.0/../../../../x86_64-pc-linux-gnu/bin/ld: lib64/libinkscape_base.so: undefined reference to `Cairo::Context::show_text(std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> > const&)'
collect2: error: ld returned 1 exit status
ninja: build stopped: subcommand failed.
 * ERROR: media-gfx/inkscape-1.0-r1::gentoo failed (compile phase):
 *   ninja -v -j16 -l0 failed
 *
 * Call stack:
 *     ebuild.sh, line  125:  Called src_compile
 *   environment, line 3127:  Called cmake_src_compile
 *   environment, line 1273:  Called cmake_build
 *   environment, line 1252:  Called eninja
 *   environment, line 1691:  Called die
 * The specific snippet of code:
 *       "$@" || die "${nonfatal_args[@]}" "${*} failed"
 *
 * If you need support, post the output of `emerge --info '=media-gfx/inkscape-1.0-r1::gentoo'`,
 * the complete build log and the output of `emerge -pqv '=media-gfx/inkscape-1.0-r1::gentoo'`.
 * The complete build log is located at '/var/tmp/portage/media-gfx/inkscape-1.0-r1/temp/build.log'.
 * The ebuild environment file is located at '/var/tmp/portage/media-gfx/inkscape-1.0-r1/temp/environment'.
 * Working directory: '/var/tmp/portage/media-gfx/inkscape-1.0-r1/work/inkscape-1.0_build'
 * S: '/var/tmp/portage/media-gfx/inkscape-1.0-r1/work/inkscape-1.0_2020-05-01_4035a4fb49'

>>> Failed to emerge media-gfx/inkscape-1.0-r1, Log file:

>>>  '/var/tmp/portage/media-gfx/inkscape-1.0-r1/temp/build.log'

 * Messages for package media-gfx/inkscape-1.0-r1:

 * ERROR: media-gfx/inkscape-1.0-r1::gentoo failed (compile phase):
 *   ninja -v -j16 -l0 failed
 *
 * Call stack:
 *     ebuild.sh, line  125:  Called src_compile
 *   environment, line 3127:  Called cmake_src_compile
 *   environment, line 1273:  Called cmake_build
 *   environment, line 1252:  Called eninja
 *   environment, line 1691:  Called die
 * The specific snippet of code:
 *       "$@" || die "${nonfatal_args[@]}" "${*} failed"
 *
 * If you need support, post the output of `emerge --info '=media-gfx/inkscape-1.0-r1::gentoo'`,
 * the complete build log and the output of `emerge -pqv '=media-gfx/inkscape-1.0-r1::gentoo'`.
 * The complete build log is located at '/var/tmp/portage/media-gfx/inkscape-1.0-r1/temp/build.log'.
 * The ebuild environment file is located at '/var/tmp/portage/media-gfx/inkscape-1.0-r1/temp/environment'.
 * Working directory: '/var/tmp/portage/media-gfx/inkscape-1.0-r1/work/inkscape-1.0_build'
 * S: '/var/tmp/portage/media-gfx/inkscape-1.0-r1/work/inkscape-1.0_2020-05-01_4035a4fb49'
```


# 原因

調べて出てきたのが、Gentoo Forumsの以下の投稿。

[Gentoo Forums :: View topic - problem emerge inkscap](https://forums.gentoo.org/viewtopic-t-1047972-start-0.html)

これによると、gccのデフォルトABIが変わったのが原因らしいです。
この変更によって、古いgccでコンパイルされた`sdx::__cxx11::string`を使っていライブラリとリンク出来なくなるらしい。

inkscapeの場合のエラーをよく見てみると、以下の部分に`std::__cxx11::basic_string`って入ってますね。

```
/usr/lib/gcc/x86_64-pc-linux-gnu/9.3.0/../../../../x86_64-pc-linux-gnu/bin/ld: lib64/libinkscape_base.so: undefined reference to `Cairo::ImageSurface::create_from_png(std::__cxx11::basic_string<char, std::char_traits<char>, std::allocator<char> >)'
```

というわけで、Cairoを含む依存ライブラリの再コンパイルが必要ということでした。

ちなみにこの変更、ちゃんとeselectで出てくるnewsとして記載されてたみたい。…2015年に。
ずいぶん放置していたのがバレてしまう…。


# 対処方法

`libstdc++.so`が問題のライブラリなので、こいつを使っているソフトを再コンパイルすれば解決出来ます。

それを実現するのが、冒頭にも記載した以下のコマンド。

``` shell
$ sudo revdep-rebuild --library libstdc++.so.6 -- --exclude gcc
```

`libstdc++.so.6`に依存するパッケージを全てリビルドする、みたいな。

これを実行したあとにもう一度Inkscapeをコンパイルすると、ちゃんとリンク出来るようになっているはずです。
