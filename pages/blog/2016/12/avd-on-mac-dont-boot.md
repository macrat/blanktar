---
title: Mac上のAndroid Virtual Deviceが起動しない
pubtime: 2016-12-14T16:59:00+09:00
tags: [Mac, Android, 環境構築]
description: Mac OSにインストールしたAndroid Virtual DeviceがDocker for macと競合してしまい起動しなくなってしまいました。
---

Android StudioでAndroidのエミュレータを起動したところ、以下のようなエラーが出て上手く起動してくれませんでした。
```
/path/to/Android/sdk/tools/emulator -avd Android_Accelerated_x86
Hax is enabled
Hax ram_size 0x40000000
HAX is working and emulator runs in fast virt mode.
emulator: Listening for console connections on port: 5554
Failed to sync vcpu reg
emulator: Serial number of this emulator (for ADB): emulator-5554
Failed to sync vcpu reg
emulator: ERROR: Unfortunately, there's an incompatibility between HAXM hypervisor and VirtualBox 4.3.30+ which doesn't allow multiple hypervisors to co-exist.  It is being actively worked on; you can find out more about the issue at http://b.android.com/197915 (Android) and https://www.virtualbox.org/ticket/14294 (VirtualBox)
Failed to sync vcpu reg
Internal error: initial hax sync failed
```

直前にアップデートを掛けていたのでHAXMがちゃんと入っていないのかと思ってインストールしなおしてみたのですが、どうも上手くいかず。

調べてみたところVirtualBoxが動いているとダメということらしいのですが、VirtualBoxも動いていない。
…と思っていたのですが、よく考えたらDocker for macが動いていました。
Docker for macって内部でVirtualBox使ってるんですよね。

というわけで、Docker for macを終了させたら無事起動しました。
コンテナだけじゃなくてdockerのサービスをまるごと終了させる必要があります。
若干面倒臭いけど、しょうがないね…。
