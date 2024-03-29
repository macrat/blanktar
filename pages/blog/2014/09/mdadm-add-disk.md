---
title: mdadmのRAID5にディスクを追加した
pubtime: 2014-09-19T23:42:00+09:00
tags: [Linux, mdadm, ストレージ]
description: mdadmで作ったRAID5のディスクアレイに新しいHDDを追加する手順の解説です。
---

PCの買い替えに伴ってディスクが余ったので、サーバーのmdadm（RAID5）に加えてみることにした。
調べながらだと面倒くさいので今後のために手順をメモ。

過去に書いた [linuxのmdadmで作ったRAID5を壊したり直したり。](/blog/2014/02/mdadm-raid5) という記事のちょっと詳しい版的な内容です。てゆかほぼ一緒ですごめんなさい。

まず、fdiskで使わなくなったパーティションを削除。`d`コマンドね。
gpartedとかでも問題ないはず。
古いディスクだからやるのであって、新しいディスクの場合は必要ありません。パーティション切る必要もなし。

で、mdadmの管理下に置く。ここでは`/dev/sde`を`/dev/md1`に追加することにします。
```
# mdadm --add /dev/md1 /dev/sde
```
これで登録(?)完了。

これをやったあとで
```
# mdadm --detail /dev/md1
```
とやると、ディスク一覧の一番下、/dev/sdeのところにspareとか書かれているはず。
この状態で他のディスクにエラーが起こると自動的にスペアと交換してくれるようです。

今回はディスク容量を増やしたいので、
```
# mdadm --grow /dev/md1 --size=4
```
とやって付け足したHDDを合わせて4台のディスクをすべて使うように伝えます。台数はもちろん環境に合わせてください。
`size=max`でも行けるらしいのですが、何かうまくいかなかったので4としてみたら動いた。うーん？

```
# cat /proc/mdstat
```
を見てみると、処理の進行状況が見えるはず。
ちなみにこの処理、ものすごい時間がかかります。うちの場合だと1T\*3から1T\*4に増やすのに26時間かかりました。長い！！

で、一日経って作業完了。
```
# mdadm --detail /dev/md1
```
を確認して、Stateがcleanになっていることを確認します。
ついでにArray Sizeが増えていることも確認。

大丈夫なら、ディスクをリサイズすればおっけー。
うちの場合はext4を使っているので、resize2fsで・・・
```
# resize2fs /dev/md1
resize2fs 1.42.10 (18-May-2014)
Please run 'e2fsck -f /dev/md1' first.
```
怒られた。

ファイルシステムチェックを先にしろ、らしいです。
言われたとおりに
```
# e2fsck -f /dev/md1
```
ファイルチェック。これは結構早かった。

問題無さそうなら改めてリサイズ。
```
# resize2fs /dev/md1
```
問題無し。これもわりと早い。

以上、こんな感じ。
結構簡単に追加できました。
問題をあげるとすれば、ものすごい時間がかかることかな・・・。


余談。
アンマウントしようとしたときに`target is busy`と言われたときは、
```
# lsof /dev/md1
```
のようにして使用中のプロセスを探して、適当に止めてあげれば何とかなります。
便利だ、このコマンド。

---

参考:
- [Growing - Linux Raid Wiki](https://raid.wiki.kernel.org/index.php/Growing)
- [6.3. ext4 ファイルシステムのサイズを変更する - redhadカスタマーポータル](https://access.redhat.com/documentation/ja-JP/Red_Hat_Enterprise_Linux/6/html/Storage_Administration_Guide/ext4grow.html)
