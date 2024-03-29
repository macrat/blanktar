---
title: イーサネット関係のヘッダ
pubtime: 2013-04-10T22:05:00+09:00
modtime: 2013-08-23T01:01:00+09:00
tags: [Linux, C言語, ネットワーク]
description: イーサネットの通信のために使う、C言語の構造体色々です。一応簡単な説明を付けてあります。
---

<ins date="2013-08-23T01:01:00+09:00">

# 2013-08-23 追記

pythonのctypesで使う用のものもどうぞ。
[ctypes用のネットワーク関係の構造体](/blog/2013/08/ethernet-header-for-python)

</ins>

旧サイトにおいてあったTCP/IP関連のヘッダ情報だよ。
整理するにあたってこっちに持ってきてみた。

# ether header
``` c
struct ether_header {
    u_char ether_dhost[ETHER_ADDR_LEN];  /* 宛先ホストのハードウェアアドレス */
    u_char ether_shost[ETHER_ADDR_LEN];  /* 送信者のハードウェアアドレス */
    u_short ether_type;                  /* ネットワーク層のプロトコル */
};
```

# ARP header
``` c
struct ether_arp {
    u_int16 arp_hrd;    /* ハードウェアのタイプ（？） */
    u_int16 arp_pro;    /* プロトコルのタイプ。arp要求だの応答だの。 */
    u_int8 arp_hln;     /* ハードウェアアドレスの長さ。普通に考えて6しか入らないんじゃ。 */
    u_int8 arp_pln      /* プロトコルアドレスの長さ。IPアドレスしか入れないだろうし、4しか入れない気がする。 */
    u_int8 arp_sha[6];  /* 送り主のハードウェアアドレス。Sourceらしい。 */
    u_int32 arp_spa;    /* 送り主のプロトコルアドレス。ちゅーかIPアドレス。 */
    u_int8 arp_tha[6];  /* 受け取り手のハードウェアアドレス。Target。ちなみに、知らないときは0で埋める */
    u_int32 arp_tpa;    /* 受け取り手のプロトコルアドレス。 */
};
```

# IP header
``` c
struct iphdr {
    u_int version:4;   /* バージョン。IPのバージョン（4）を入れればいいらしい */
    u_int ihl:4;       /* ヘッダの長さ。ヘッダって固定長じゃないの・・・？ */
    u_int8 tos;        /* サービスタイプ。優先順位？　でも0で固定らしい。 */
    u_int16 tot_len;   /* パケットの長さ。 */
    u_int16 id;        /* 送信されたパケットのカウント。分割されたデータの場合は、同じ値が入る。 */
    u_int16 flag_off;  /* 最初の1ビットが0で、2ビット目がデータを分割していいかどうかのフラグ。3ビット目は分割した最後のパケットなら0、そうじゃなきゃ1。
                          4ビット目以降は分割前のデータの何ビット目から始まるのか。よく分からん。 */
    u_int8 ttl;        /* 世に名高いTTL。通過できるルーターの数。 */
    u_int8 protocol;   /* トランスポート層のプロトコル。 */
    u_int16 check;     /* ヘッダが壊れていないかのチェックサム */
    u_int32 saddr;     /* 送信元のIPアドレス */
    u_int32 daddr;     /* 宛先のIPアドレス。Sourceは分かってもdってなんだdって。 */
};
```
versionの後:4というのは4ビットという意味。ちっちゃすぎるだろ・・・！
つまり当然だけれど、versionとihlはエンディアンで入れ替わる。めんどくさすぎるよ。

# ICMP header
``` c
struct icmp {
    u_int8 icmp_type;    /* そのまんま、タイプ。 */
    u_int8 icmp_code;    /* タイプ別で、フラグみたいなのが格納されるっぽい。トラブルの内容とか入れる。 */
    u_int16 icmp_cksum;  /* チェックサム。ヘッダどメッセージ色々をあわせて計算するらしい。 */
};
```
