---
title: ctypes用のネットワーク関係の構造体
pubtime: 2013-08-23T01:01:00+09:00
tags: [Linux, Python, ネットワーク]
description: Python/ctypesで使用するための、イーサネット関係の構造体色々を定義してみました。
---

<ins date="2013-08-23T01:01:00+09:00">

# 2013-08-23 追記

C言語で書いた普通のものはこちらをどうぞ。 

[イーサネット関係のヘッダ](/blog/2013/04/ethernet-header)

</ins>

*PyPyCap*の作成途中で作ったんだけど、結局使わなかったやつ。
元々は構造体にキャストしてパースする予定だったんだけど、途中から添字直打ちに変更しちゃったのよねー。

このまま捨てるのもくやしいので、役立ててくれどこかの誰かっ

``` python
class st_ether_header(BigEndianStructure):
	_fields_ = [
		('ether_dhost', c_uint8 * 6),
		('ether_shost', c_uint8 * 6),
		('ether_type', c_ushort),
	]

class st_ip_header(BigEndianStructure):
	_fields_ = [
		('ihl_and_version', c_uint8),
		('tos', c_uint8),
		('tot_len', c_uint16),
		('id', c_uint16),
		('frag_off', c_uint16),
		('ttl', c_uint8),
		('protocol', c_uint8),
		('check', c_uint16),
		('saddr', c_uint32),
		('daddr', c_uint32),
	]

class st_tcp_header(BigEndianStructure):
	_fields_ = [
		('source', c_uint16),
		('dest', c_uint16),
		('seq', c_uint32),
		('ack_seq', c_uint32),
		('flags', c_uint16),
		('windows', c_uint16),
		('check', c_uint16),
		('urg_ptr', c_uint16),
	]

class st_udp_header(BigEndianStructure):
	_fields_ = [
		('source', c_uint16),
		('dest', c_uint16),
		('len', c_uint16),
		('check', c_uint16)
	]
```
