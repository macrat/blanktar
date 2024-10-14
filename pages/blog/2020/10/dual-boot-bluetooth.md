---
title: Linux/Windowsのデュアルブート環境でBluetoothやBLEのデバイスを共有する方法
pubtime: 2020-10-07T19:49:00+09:00
modtime: 2024-10-14T15:50:00+09:00
tags: [Linux, Windows, 環境構築]
description: デュアルブート環境で同じBluetoothやBLEのデバイスを使おうとすると、OSを変えて起動する度にペアリングしなおさないといけなくて面倒です。少し作業をすることでこれを回避出来るようだったので、試してみました。
image: [/blog/2020/10/dual-boot-bluetooth.png]
faq:
  - question: デュアルブート環境でBluetooth/BLEのデバイスを共有する方法は？
    answer: 接続情報をいじって、ペアリング時に生成されるキーを共有してあげると再ペアリングしなくても接続出来るようになります。
howto:
  tools: [Bluetooth対応のPC, 接続したいBluetoothデバイス]
  totalTime: PT10M
  step:
    - name: Linux側でペアリングする
      text: まず始めに、Linuxとデバイスのペアリングをします。
      url: "#1.%20Linux側でペアリングする"
    - name: Windows側でペアリングする
      text: 次に、Windowsでデバイスとペアリングします。
      url: "#2.%20Windows側でペアリングする"
    - name: Windowsのレジストリから情報を取り出す
      text: |
        Windowsのレジストリから、デバイスとの接続に関する情報を取り出します。
        必要な情報は `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTHPORT\Parameters\Keys` 以下にあります。
      url: "#3.%20Windowsのレジストリから情報を取り出す"
    - name: Linuxに戻って接続情報を編集する
      text: |
        Linuxに戻ったら、 `/var/lib/bluetooth/{レシーバのmacアドレス}/{デバイスのmacアドレス}/info` にある接続情報を編集します。
        Bluetoothの場合は`LinkKey.Key`を、Bluetooth LEの場合は`LongTermKey.Key`と`LongTermKey.EDiv`、`LongTermKey.Rand`のそれぞれをWindowsのレジストリ情報に合わせます。
      url: "#4.%20Linuxに戻って接続情報を編集する"
    - name: Bluetoothデーモンを再起動して確認する
      text: 編集が完了したら、Bluetoothデーモンを再起動して接続出来るか試します。
      url: "#5.%20Bluetoothデーモンを再起動して確認する"
---

私のPCは普段使いのGentoo LinuxとゲームとかCADとか用のWindowsの両方をインストールしてあります。
そんなデュアルブート環境だと、OSを変えるたびにBluetoothデバイスを再ペアリングする必要があってちょっと面倒臭いことになります。

この原因は、ペアリングのときに生成されるキーをOS間で共有出来ないことにあるようです。
デバイスから見ると、「同じMACアドレスを名乗っているのに約束していたキーと違う。偽物だ！」みたいな感じらしいです。

調べてみたら結構簡単に合せられるっぽいので、設定してみました。
Bluetoothの場合とBluetooth LE (以下BLE)の場合で一部手順が違うので、お使いのデバイスに合わせて対応してください。

BluetoothとBLEのどちらも、全体としては以下のような流れで作業します。

1. [Linux側でペアリングする](#1.+Linux側でペアリングする): 接続情報のファイルを生成するために、まずはLinux側で接続します。
2. [Windows側でペアリングする](2.+Windows側でペアリングする): Windows側でも接続して、最終的に使うキーを生成します。
3. [Windowsのレジストリから情報を取り出す](3.+Windowsのレジストリから情報を取り出す): Windowsが作った接続に必要な情報を取り出します。
4. [Linuxに戻って接続情報を編集する](4.+Linuxに戻って接続情報を編集する): 3で取り出した情報を加工して、1で作ったファイルに書き込みます。


# 1. Linux側でペアリングする

まずはLinuxを起動して、対象のデバイスと普通にペアリングをします。
bluetoothctlやbluemanなどを使っていつも通り接続してください。

接続すると、`/var/lib/bluetooth/{レシーバのmacアドレス}/{デバイスのmacアドレス}`の中に接続情報が書かれたファイルが生成されるはずです。


# 2. Windows側でペアリングする

今度はWindowsを起動して、もう一度ペアリングします。

ここでWindowsとデバイス間で作られたキーの情報を使って接続するようにします。
別にLinux側で作ったやつをWindows側に持っていっても良いはずなのですが、Linux側の方がいじりやすいのでこの手順にしています。


# 3. Windowsのレジストリから情報を取り出す

<ins date="2021-07-09">

## 2021-07-09 追記

新しいデバイスを買ったので同じことをやろうとしたら、必要な情報を見つけられませんでした。
どうやらWindowsのアップデートか何かで仕様が変わったようです。

下記の方法で見つけられない場合、この記事の末尾にある[別の方法](#別の方法:%20regedit.exeで目的のキー情報を見付けられない場合)が使えるかもしれません。

</ins>

Windowsが作ったキーが欲しいので、regedit.exeを使ってレジストリの以下の場所にある情報をエクスポートします。

```
HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\BTHPORT\Parameters\Keys
```

これを適当なエディタで開いて確認してみると、以下のような内容になっているはずです。
文字コードがUTF-16LEなので注意。

``` toml
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\BTHPORT\Parameters\Keys]

[HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\BTHPORT\Parameters\Keys\001bdcxxxxxx]
"MasterIRK"=hex:08,ce,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx
"cc988bxxxxxx"=hex:84,ed,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx

[HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\BTHPORT\Parameters\Keys\001bdcxxxxxx\d3bc56xxxxxx]
"LTK"=hex:a8,76,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,f8
"KeyLength"=dword:00000010
"ERand"=hex(b):eb,00,00,00,00,00,00,89
"EDIV"=dword:00ab0123
"MasterIRKStatus"=dword:00000001
"AuthReq"=dword:0000002d
```


# 4. Linuxに戻って接続情報を編集する

Linuxに戻って、`/var/lib/bluetooth/{レシーバのmacアドレス}/{デバイスのmacアドレス}/info`を開きます。
レシーバとデバイスのmacアドレスは以下のコマンドで見付けられると思います。

``` bash
# レシーバの一覧
$ bluetoothctl list
Controller 00:1B:DC:XX:XX:XX hostname [default]

# ペアリングしているデバイスの一覧
$ bluetoothctl devices
Device D3:BC:56:XX:XX:XX Microsoft Bluetooth Mouse
Device CC:98:8B:XX:XX:XX WH-1000XM3
```

ここからは、Bluetoothの場合とBluetooth LEの場合で分岐します。
開いた`info`ファイルの中に`[LinkKey]`という記述がある場合は[Bluetoothの場合](#Bluetoothの場合)に、`[LongTermKey]`という記述がある場合は[Bluetooth LEの場合](#Bluetooth%20LEの場合)に進んでください。

## Bluetoothの場合

### 必要な情報を探す

Windows側でエクスポートした.regファイルから、以下のようなセクションを見つけます。

``` toml
[HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\BTHPORT\Parameters\Keys\001bdcxxxxxx]
"MasterIRK"=hex:08,ce,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx
"cc988bxxxxxx"=hex:84,ed,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx
```

`Keys\001bdcxxxxxx`の部分がレシーバのmacアドレスになっているはずです。
この中からデバイスのmacアドレスと対応する値を見つけ出してコピーします。

今回は`"cc988bxxxxxx"`とペアリングしたいので、`84,ed,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx`の部分をコピーします。
カンマは不要なので削除して、ついでにLinux側に合わせて大文字にしておきます。（小文字でも別に良いっぽいけれど）

### ファイルに反映する

コピーしてカンマを消した値を使って、Linux側の`info`ファイルを以下のような感じで編集します。

``` toml
[LinkKey]
Key=84EDXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Type=4
PINLength=0
```

これでキーの移行は完了です。

## Bluetooth LEの場合

### 必要な情報を探す

Windows側でエクスポートした.regファイルから、以下のようなセクションを見つけます。
Bluetoothの場合と違って結構長いです。

``` toml
[HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\BTHPORT\Parameters\Keys\001bdcxxxxxx\d3bc56xxxxxx]
"LTK"=hex:a8,76,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,f8
"KeyLength"=dword:00000010
"ERand"=hex(b):eb,00,00,00,00,00,00,89
"EDIV"=dword:00ab0123
"MasterIRKStatus"=dword:00000001
"AuthReq"=dword:0000002d
```

`Keys\001bd0cxxxxxx`の部分がレシーバのmacアドレスで、その後に続く`\d3bc56xxxxxx`の部分がデバイスのmacアドレスになっています。
複数デバイスある場合はこのセクションが複数あるはずなので、必要なものを見つけてください。

### 加工する

ここで必要なのは以下の3つの情報です。
ついでに色々加工をします。

- **LTK**: `hex:`の後ろの`a8,76,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,f8`からカンマを取って、`A876XXXXXXXXXXXXXXXXXXXXXXXXXXF8`のようにして使います。
- **ERand**: `hex(b):`の後ろの`eb,00,00,00,00,00,00,89`を左右反転（`89,00,00,00,00,00,00,eb`）してカンマを取って、10進数（`9871890383196127467`）にして使います。
- **EDIV**: `dword:`の後ろの`00ab0123`を10進数にして、`11206947`のようにして使います。

諸々の変換はPythonとか使うと楽かもしれません。

``` python
>>> # LTKの加工
>>> 'a8,76,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,xx,f8'.replace(',', '').upper()
A876XXXXXXXXXXXXXXXXXXXXXXXXXXF8

>>> # ERandの加工
>>> int(''.join(reversed('eb,00,00,00,00,00,00,89'.split(','))), 16)
9871890383196127467

>>> # EDIVの加工
>>> int('00ab0123', 16)
11206947
```

### ファイルに反映する

加工した情報を使って、Linux側の`info`ファイルの`LongTermKey`セクションを以下のように書き換えます。

``` toml
[LongTermKey]
Key=A876XXXXXXXXXXXXXXXXXXXXXXXXXXF8
Authenticated=0
EncSize=16
EDiv=11206947
Rand=9871890383196127467
```

値はそれぞれ、`LTK`→`Key`、`ERand`→`Rand`、`EDIV`→`EDiv`になります。


# 5. Bluetoothデーモンを再起動して確認する

これで、Windows側で生成したキーをLinux側でも使えるようになっているはずです。
変更を反映させるために、デーモンを再起動させましょう。

``` bash
$ sudo systemctl restart bluetooth
```

問題無く設定出来ていれば、再ペアリングすることなく両方のOSから接続出来るようになっているはずです。
やったね。


# 別の方法: regedit.exeで目的のキー情報を見付けられない場合

上記の方法ではregedit.exeでエクスポートしましたが、Linuxのchntpwコマンドを使う方法もあります。
情報の抜き出し方が違うだけで、それ以外の手順は変わりません。

## Linux側にchntpwをインストールする

まずはLinuxに[chntpw](http://pogostick.net/~pnh/ntpasswd/)をインストールします。
元々はWindowsのパスワードを変えるためのコマンドなので **CHange NT PassWord** という名前みたいです。
レジストリの閲覧機能があるので、これを使って情報を取り出します。

apt-get、yum、portageなど主要なパッケージマネージャで入るようです。

## Windowsのストレージをマウントする

レジストリを見るために、まずはWindowsがインストールされたパーティションをLinuxにインストールします。

``` bash
$ sudo mount /dev/sdb4 /mnt/win
```

デバイス名、マウント先はよしなに。
もしかしたら、NTFSをマウントするためのfuseのインストールが必要かもしれません。

## レジストリを開いて目的のデバイスを探す

以下のコマンドでchntpwを起動します。

```
$ chntpw -e /mnt/win/Windows/System32/config/SYSTEM
chntpw version 1.00 140201, (c) Petter N Hagen
Hive </mnt/win/Windows/System32/config/SYSTEM> name (from header): <SYSTEM>
ROOT KEY at offset: 0x001020 * Subkey indexing type is: 686c <lh>
File size 20185088 [1340000] bytes, containing 4299 pages (+ 1 headerpage)
Used for data: 302800/19733216 blocks/bytes, unused: 125/129984 blocks/bytes.

Simple registry editor. ? for help.

>
```

この時点で、regedit.exeで言う `HKEY_LOCAL_MACHINE\SYSTEM` に相当する位置がカレントディレクトリになっています。
ここから `ls` と `cd` を使って `HKEY_LOCAL_MACHINE\SYSTEM\ControlSet001\Services\BTHPORT\Parameters\Keys\001bdcxxxxxx` に相当する場所まで潜っていきます。

```
> cd ControlSet001\Services\BTHPORT\Parameters\Keys

(...)\Services\BTHPORT\Parameters\Keys> ls
Node has 2 subkeys and 0 values
  key name
  <001bdxxxxxxx>

(...)\BTHPORT\Parameters\Keys> cd 001bdxxxxxx
```

上記の `001bdxxxxxx` がPCについているレシーバのアドレスです。

ここで `ls` を実行すると、以下のようにWindows側で接続されているデバイスの一覧が表示されます。

```
(...)\Parameters\Keys\001bdxxxxxxx> ls
Node has 2 subkeys and 4 values
  key name
  <d3bc56xxxxxx>
  <e834dbxxxxxx>
  size     type              value name             [value if type DWORD]
    16  3 REG_BINARY         <88d039xxxxxx>
    16  3 REG_BINARY         <cc988bxxxxxx>
    16  3 REG_BINARY         <MasterIRK>
    16  3 REG_BINARY         <e09f2axxxxxx>
```

上に表示されている `d3bc56xxxxxx` と `e834dbxxxxxx` がBLEデバイスで、下に表示されている `88d039xxxxxx` や `cc988bxxxxxx` がBluetoothデバイスです。

## 必要な情報を探してLinux側に反映する

### Bluetoothデバイス

Bluetoothの場合のやり方はかなり単純で、以下のように `hex` コマンドを使うと必要なLinkKeyを取り出せます。

```
(...)\Parameters\Keys\001bdxxxxxxx> hex cc988bxxxxxx
Value <cc988bxxxxxx> of type REG_BINARY (3), data length 16 [0x10]
:00000  84 10 10 XX XX XX XX XX XX XX XX XX XX 27 CE ED ................
```

この場合、 `841010XXXXXXXXXXXXXXXXXXXX27CEED` がLinkKeyになります。

なので、Linux側の`info`ファイルの内容は以下のようになります。

``` toml
[LinkKey]
Key=84EDXXXXXXXXXXXXXXXXXXXXXXXXXXXX
Type=4
PINLength=0
```

### BLEデバイス

BLEの場合はディレクトリになっているので、まずはその中に入ります。

```
(...)\BTHPORT\Parameters\Keys\001bdcxxxxxx> cd e834dbxxxxxx

(...)\Parameters\Keys\001bdcxxxxxx\e834dbxxxxxx> ls
Node has 0 subkeys and 9 values
  size     type              value name             [value if type DWORD]
    16  3 REG_BINARY         <LTK>
     4  4 REG_DWORD          <KeyLength>               16 [0x10]
     8  b REG_QWORD          <ERand>
     4  4 REG_DWORD          <EDIV>                  1234 [0x042d]
    16  3 REG_BINARY         <IRK>
     8  b REG_QWORD          <Address>
     4  4 REG_DWORD          <AddressType>              1 [0x1]
     4  4 REG_DWORD          <MasterIRKStatus>          1 [0x1]
     4  4 REG_DWORD          <AuthReq>                 45 [0x2d]
```

ここで、 `LTK` `ERand` `EDIV` の3つを取り出します。

`EDIV` については表示されている10進数の値(上記の例だと `1234`)がそのまま使えます。

`LTK` と `ERand` は下記のように `hex` コマンドで取得します。

```
(...)\Parameters\Keys\001bdcxxxxxx\d3bc56xxxxxx> hex LTK
Value <LTK> of type REG_BINARY (3), data length 16 [0x10]
:00000  A8 EC B2 XX XX XX XX XX XX XX XX XX XX F4 AD 76 ................


(...)\Parameters\Keys\001bdcxxxxxx\d3bc56xxxxxx> hex ERand
Value <ERand> of type REG_QWORD (b), data length 8 [0x8]
:00000  23 00 00 00 00 00 00 EB                         ........
```

`LTK` はスペースを消せばそのまま使えるのですが、 `ERand` は[もう一個の方法のregedit.exeを使った場合と同じ加工](#加工する)が必要になります。

というわけで、この例だとLinux側の`info`ファイルは以下のようになります。

``` toml
[LongTermKey]
Key=A8ECB2XXXXXXXXXXXXXXXXXXXXF4AD76
Authenticated=0
EncSize=16
EDiv=1234
Rand=16933534598913064995
```

---

参考:

- [Windows10とUbuntu18.04のデュアルブート環境で1つのBluetoothキーボードを両OSでペアリングして使う方法 - Qiita](https://qiita.com/yoko-yan/items/9b0235678fd804b4fe0d)
- [デュアルブート環境で、Bluetooth Low Energy (LE) マウスを快適に使う - 社長、ティッシュどこですか？](https://thewayout.hatenablog.com/entry/2018/09/24/205134)
- [Bluetooth mouse in dual boot of Windows 10 and Linux | DesktopI18N&#039;s Blog](https://desktopi18n.wordpress.com/2018/02/02/bluetooth-mouse-in-dual-boot-of-windows-10-and-linux/)
- [NKT(長く苦しい戦い)であったデュアルブート環境でbluetoothマウスを動くようにすることに成功ス！ - yumetodoの旅とプログラミングとかの記録](https://yumetodo.hateblo.jp/entry/2021/01/15/200421)
