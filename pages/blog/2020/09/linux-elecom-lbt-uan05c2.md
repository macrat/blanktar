---
title: ELECOM LBT-UAN05C2のGentoo Linuxでの動作報告
pubtime: 2020-09-15T19:16:00+09:00
tags: [Gentoo, Linux, ハードウェア]
description: 新しいBluetoothドングルを書いました。ELECOMのLBT-UAN05C2ってやつ。Gentoo Linuxでもちゃんと動いたので、細かいスペックなどを含めた動作報告記事です。
image: [/blog/2020/09/linux-elecom-lbt-uan05c2.png]
faq:
  - question: ELECOM LBT-UAN05C2はGentoo Linuxで動く？
    answer: （私の環境では）動いた。
  - question: ELECOM LBT-UAN05C2はGentoo以外のLinuxでは動く？
    answer: わからん。特殊なデバイスは必要無さそうなので、動く気がします。
  - question: ELECOM LBT-UAN05C2のチップセットは？
    answer: Cambridge Sillicon Radioの**CSR8510 A10**ってやつ。
---

何も考えずにBluetoothマウスを買ったのですが、PC側が古すぎて（Bluetooth2.1！）繋がらなかったので、Bluetoothドングルを書いました。
[ELECOMのBLT-UAN05C2](https://www.elecom.co.jp/products/LBT-UAN05C2.html)ってやつ。
せっかくなのでClass1が欲しかったけれど、[Amazonで買う](https://www.amazon.co.jp/dp/B00J84V7OM)と1,000円くらいで安かったのと、Linuxでの動作報告もいくつか（[小枝チョコレート](https://ich.hatenadiary.com/entry/bluetooth-adapter-linux)さんや[Linux移行メモ](http://elmoa.ichi-matsu.net/klue/bluetooth%E3%83%87%E3%83%90%E3%82%A4%E3%82%B9%E8%B2%B7%E3%81%A3%E3%81%9F%E3%81%AE%E3%81%A7bluetoot)さんなど）あったのでこれにしました。

結果、単純に差すだけで何事もなく動いてくれました。

Windowsでの動作の評判は微妙っぽい（途切れるとか？）ですが、Linuxに関しては特に問題無いような感じがします。
30分以上Bluetoothヘッドホンで音楽を聞いてみたりしていますが途切れたりする様子はありません。


# BLT-UAN05C2のスペック

- メーカ: ELECOM
- メーカ型番: LBT-UAN05C2
- Class: Class 2
- チップセット: [Cambridge Sillicon Radio, Ltd **CSR8510 A10**](https://www.qualcomm.com/products/csr8510)


# 動作を確認した環境

- OS: Gentoo Linux (Linux 5.4.38)
- Bluez: バージョン 5.54

## カーネルオプション

感覚で設定してるので、関係無いのも入ってるかもです。

```
[*] Networking support --->
  <*> Bluetooth subsystem support --->
    [*] Bluetooth Classic (BR/EDR) features
    <*>   RFCOMM protocol support
    <*>   HIDP protocol support
    [*]   Bluetooth High Speed (HS) features
    [*] Bluetooth Low Energy (LE) features
    [*] Export Bluetooth internals in debugfs
        Bluetooth device drivers --->
          <*> HCI USB driver
          [*]   Broadcom protocol support
          <*> HCI UART driver
```

## BluezのUSEフラグ

特別なところは何も無い気がしますが、一応メモ程度に。

```
mesh obex readline systemd udev -btpclient -cups -debug -deprecated -doc -experimental -extra-tools -midi (-selinux) -test -test-programs -user-session
```


# dmesgの認識

```
[   28.929327] usb 3-4: new full-speed USB device number 4 using xhci_hcd
[   44.576338] usb 3-4: device descriptor read/64, error -110
[   44.818243] usb 3-4: New USB device found, idVendor=0a12, idProduct=0001, bcdDevice=88.91
[   44.818252] usb 3-4: New USB device strings: Mfr=0, Product=2, SerialNumber=0
[   44.818278] usb 3-4: Product: CSR8510 A10
```

なんかエラー出てるけど普通に動きます。なんだこれ。


# lsusbの認識

```
$ lsusb -s 003:004 -v

Bus 003 Device 004: ID 0a12:0001 Cambridge Silicon Radio, Ltd Bluetooth Dongle (HCI mode)
Device Descriptor:
  bLength                18
  bDescriptorType         1
  bcdUSB               2.00
  bDeviceClass          224 Wireless
  bDeviceSubClass         1 Radio Frequency
  bDeviceProtocol         1 Bluetooth
  bMaxPacketSize0        64
  idVendor           0x0a12 Cambridge Silicon Radio, Ltd
  idProduct          0x0001 Bluetooth Dongle (HCI mode)
  bcdDevice           88.91
  iManufacturer           0 
  iProduct                2 CSR8510 A10
  iSerial                 0 
  bNumConfigurations      1
  Configuration Descriptor:
    bLength                 9
    bDescriptorType         2
    wTotalLength       0x00b1
    bNumInterfaces          2
    bConfigurationValue     1
    iConfiguration          0 
    bmAttributes         0xe0
      Self Powered
      Remote Wakeup
    MaxPower              100mA
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        0
      bAlternateSetting       0
      bNumEndpoints           3
      bInterfaceClass       224 Wireless
      bInterfaceSubClass      1 Radio Frequency
      bInterfaceProtocol      1 Bluetooth
      iInterface              0 
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x81  EP 1 IN
        bmAttributes            3
          Transfer Type            Interrupt
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0010  1x 16 bytes
        bInterval               1
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x02  EP 2 OUT
        bmAttributes            2
          Transfer Type            Bulk
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0040  1x 64 bytes
        bInterval               1
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x82  EP 2 IN
        bmAttributes            2
          Transfer Type            Bulk
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0040  1x 64 bytes
        bInterval               1
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       0
      bNumEndpoints           2
      bInterfaceClass       224 Wireless
      bInterfaceSubClass      1 Radio Frequency
      bInterfaceProtocol      1 Bluetooth
      iInterface              0 
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x03  EP 3 OUT
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0000  1x 0 bytes
        bInterval               1
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x83  EP 3 IN
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0000  1x 0 bytes
        bInterval               1
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       1
      bNumEndpoints           2
      bInterfaceClass       224 Wireless
      bInterfaceSubClass      1 Radio Frequency
      bInterfaceProtocol      1 Bluetooth
      iInterface              0 
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x03  EP 3 OUT
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0009  1x 9 bytes
        bInterval               1
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x83  EP 3 IN
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0009  1x 9 bytes
        bInterval               1
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       2
      bNumEndpoints           2
      bInterfaceClass       224 Wireless
      bInterfaceSubClass      1 Radio Frequency
      bInterfaceProtocol      1 Bluetooth
      iInterface              0 
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x03  EP 3 OUT
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0011  1x 17 bytes
        bInterval               1
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x83  EP 3 IN
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0011  1x 17 bytes
        bInterval               1
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       3
      bNumEndpoints           2
      bInterfaceClass       224 Wireless
      bInterfaceSubClass      1 Radio Frequency
      bInterfaceProtocol      1 Bluetooth
      iInterface              0 
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x03  EP 3 OUT
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0019  1x 25 bytes
        bInterval               1
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x83  EP 3 IN
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0019  1x 25 bytes
        bInterval               1
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       4
      bNumEndpoints           2
      bInterfaceClass       224 Wireless
      bInterfaceSubClass      1 Radio Frequency
      bInterfaceProtocol      1 Bluetooth
      iInterface              0 
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x03  EP 3 OUT
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0021  1x 33 bytes
        bInterval               1
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x83  EP 3 IN
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0021  1x 33 bytes
        bInterval               1
    Interface Descriptor:
      bLength                 9
      bDescriptorType         4
      bInterfaceNumber        1
      bAlternateSetting       5
      bNumEndpoints           2
      bInterfaceClass       224 Wireless
      bInterfaceSubClass      1 Radio Frequency
      bInterfaceProtocol      1 Bluetooth
      iInterface              0 
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x03  EP 3 OUT
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0031  1x 49 bytes
        bInterval               1
      Endpoint Descriptor:
        bLength                 7
        bDescriptorType         5
        bEndpointAddress     0x83  EP 3 IN
        bmAttributes            1
          Transfer Type            Isochronous
          Synch Type               None
          Usage Type               Data
        wMaxPacketSize     0x0031  1x 49 bytes
        bInterval               1
can't get device qualifier: Resource temporarily unavailable
can't get debug descriptor: Resource temporarily unavailable
Device Status:     0x0001
  Self Powered
```
