---
title: Linuxのパッケージマネージャを"とりあえず使う"ための早見表
pubtime: 2015-01-24T21:49:00+09:00
amp: hybrid
tags: [Linux, パッケージマネージャ]
description: Linuxの主要なディストリビューションに入っているパッケージマネージャの、最低限必要そうなコマンドの早見表です。
---

世の中にはいろんなディストリビューションという奴があって、それぞれにパッケージマネージャというのがあって、そんなわけでいろんなパッケージマネージャがあります。

まあでもそんなことはどうでも良いんだきちんと動きさえすれば、という方のためのパッケージマネージャの使い方早見表。

|名称        |使われている場所|アップデート                                  |検索                           |インストール                     |アンインストール               |
|------------|----------------|----------------------------------------------|-------------------------------|---------------------------------|-------------------------------|
|**APT**     |Debian系        |`apt-get update`<br />`apt-get upgrade`       |`apt-cache search [検索ワード]`|`apt-get install [パッケージ名]` |`apt-get purge [パッケージ名]` |
|**aptitude**|Debian系        |`aptitude update`<br />`aptitude full-upgrade`|`aptitude search [検索ワード]` |`aptitude install [パッケージ名]`|`aptitude purge [パッケージ名]`|
|**Homebrew**|OS X            |`brew update`                                 |`brew search [検索ワード]`     |`brew install [パッケージ名]`    |`brew remove [パッケージ名]`   |
|**MacPorts**|OS X            |`port selfupdate`<br />`port upgrade outdated`|`port search [検索ワード]`     |`port install [パッケージ名]`    |`port uninstall [パッケージ名]`|
|**pacman**  |Arch Linux      |`pacman -Syu`                                 |`pacman -Ss [検索ワード]`      |`pacman -S [パッケージ名]`       |`pacman -Rs [パッケージ名]`    |
|**portage** |Gentoo Linux    |`emerge --sync`<br />`emerge -uD world`       |`emerge -s [検索ワード]`       |`emerge [パッケージ名]`          |`emerge -C [パッケージ名]`     |
|**Yum**     |RedHad系        |`yum update`                                  |`yum search [検索ワード]`      |`yum install [パッケージ名]`     |`yum remove [パッケージ名]`    |

とりあえずメジャー・・・ってか、自分が使う(or使いそう)なものだけ。

こうやってみるとpacmanのオプションの短さは異質だな・・・。

---

参考:
- [aptitudeコマンド（パッケージの管理）](http://www.garunimo.com/program/linux/aptitude.xhtml)

- [Homebrewの導入と使い方 | CAPH TECH](http://tech.caph.jp/2011/04/06/homebrew%E3%81%AE%E5%B0%8E%E5%85%A5%E3%81%A8%E4%BD%BF%E3%81%84%E6%96%B9/)

- [MacPortsの基本的な使い方とコマンド : アシアルブログ](http://blog.asial.co.jp/371)

- [yumコマンドの使い方 (偉大なるOSS)](http://max01.skr.jp/blog/2006/12/yum.html)

- [pacman (日本語) - ArchWiki](https://wiki.archlinux.org/index.php/Pacman_%28%E6%97%A5%E6%9C%AC%E8%AA%9E%29#.E3.83.91.E3.83.83.E3.82.B1.E3.83.BC.E3.82.B8.E3.81.AE.E3.82.A2.E3.83.83.E3.83.97.E3.82.B0.E3.83.AC.E3.83.BC.E3.83.89)
