---
title: wpa_supplicant使ってWPA2エンタープライズなWi-Fiに繋ぎたい
pubtime: 2015-11-09T20:00:00+09:00
modtime: 2015-11-11T00:00:00+09:00
tags: [Linux, 環境構築]
description: linuxのwpa_supplicantを使ってWPA2 エンタープライズなWi-Fiに接続するための設定ファイルの書き方です。
---

Wi-Fi使ってますか。その認証はエンタープライズですか。
一々Wi-Fi繋いでからブラウザでログインしてーとかやると面倒なので、大学のWi-Fiがエンタープライズ認証になってからとても幸せな日々を送っております。
という感じで素敵なWPA2 エンタープライズ認証なわけですが、これlinuxから設定するとちょこっと面倒臭いんですよね。まあ、正しくはGUIの便利ツール使わずにやろうとすると、なわけですが。

まあともかくですよ。**wpa_supplicant**で設定しようとすると色々と設定ファイルが面倒なので、うちの環境の場合の設定ファイルを公開しておきます。

我が大学の環境は

- セキュリティの種類： WAP2 - エンタープライズ
- 暗号化の種類： AES
- ネットワークの認証方法： PEAP
- サーバ証明書： なし
- フェーズ2認証： MSCHAPv2

らしいです。

では設定ファイル。`/etc/wpa_supplicant/wpa_supplicant.conf`あたりにあるやつです。多分。
```
ctrl_interface=/var/run/wpa_supplicant
load_dynamic_eap=/usr/lib/wpa_supplicant/eap_tls.so
load_dynamic_eap=/usr/lib/wpa_supplicant/eap_md5.so

ctrl_interface_group=0

network={
    ssid="this is SSID"
    scan_ssid=1
    identity="your user name"
    password="here is password"
    key_mgmt=WPA-EAP
}
```
こんな感じで。

`load_dynamic_eap`あたりが重要なようです。よく分かりません。
勿論ですが、*this is SSID*と*your user name*、*here is password*は書き換えて使ってくださいね。

ではでは、無事に繋がることをお祈りしております。

<ins date="2015-11-11">

# 2015-11-11 追記

passwordを平文で書きたくない場合、ハッシュ値を書くことも出来るようです。
詳細はarch linuxのフォーラムに[やり方](https://bbs.archlinux.org/viewtopic.php?id=144471)が載っているのでご覧ください。

</ins>
