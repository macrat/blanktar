---
title: btrfsで作ったRAIDのHDDが壊れた。ので、交換した。
pubtime: 2017-10-03T18:38:00+09:00
tags: [Linux, Btrfs, ストレージ]
description: btrfsでRAIDにしているHDDが故障した場合に、そのHDDを交換する方法のメモです。
---

HDDが壊れました。なんだか急にファイルサーバーにアクセス出来なくなって、何かと思ったらHDDが壊れてました。
dmesgを見ていると、`critical medium error`とかいうのがひたすら出続ける感じ。correct出来ていたので完全に読めないわけじゃないみたいなんですが、直ってもすぐ壊れそうなので交換しました。
自宅のファイルサーバーをbtrfsにして初のディスク交換なので、やった作業をメモ。

<ins date="2020-06-17">

# 2020-06-17 追記

この記事では`degraded`オプションを付けないとマウント出来ない状態のHDDを交換しましたが、[まだマウントも読み書きも出来る状態で交換する記事](/blog/2020/06/btrfs-replace-hdd)も書きました。
怪しいけどマウント出来るときや、単純に新しいHDDに交換したいときはこちらをお試しください。

</ins>

# まずは物理的に交換
そもそもどのデバイスが壊れたのかよう分からんなんてこともあるわけですが、今回はdmesgにエラーが出てたのでわりと簡単に判明。
名前さえ分かればhdparmとか使ってどのディスクなのか特定すれば良いと思います。この例は`/dev/sdc`が壊れてた場合。

```
# hdparm -i /dev/sdc
```

ddとかで読み込み発生させてアクセスランプ光らせる方法もあるにはある(というか今回やった)のですが、状況によっては色々壊れそうなのであんまりアクセスしない方が良い気もします。よく分からないけど。

で、ディスクを買いに走って交換。
まともに読める場合は`btrfs replace`ってコマンドで比較的速めに交換作業が出来るらしいのですが、今回はダメっぽかったので諦めて引っこ抜いちゃいました。

# 今度はソフト的に交換
交換はオンラインでやるので、まずは縮退モードでマウントします。気持ち的にはro付けたいけど、付けるとデバイスの追加/削除が出来ないので我慢です。

デバイス名はとりあえず`/dev/sdb`としているけれど、環境に合わせてよしなに。マウント出来ればそれで良いと思います。
マウント先はここでは`/mnt/btrfs`。こちらもよしなに。

```
# mount -o degraded /dev/sdb /mnt/btrfs
```

マウント出来たら、新しいハードディスクを追加します。ここでは`/dev/sdc`が新しいやつ。
既にパーティションが切ってあるディスクだと断わられちゃいますが、`-f`オプションを付けてやればおっけーです。

```
# btrfs device add /dev/sdc /mnt/btrfs
```

最後に、壊れたディスクをファイルシステムから切り離します。
RAIDの場合は切り離しつつ自動で再構成するので、めっちゃ時間が掛かるのを覚悟してから始めてください。私は迂闊にやってびっくりしました。

```
# btrfs device remove missing /mnt/btrfs
```

`btrfs device stats`とか`btrfs filesystem usage`とか見ながら祈ったり、次の日まで寝たりすると良いと思います。

これで交換作業は完了、なはずです。
この記事を書いている時点ではリバランスがまだ全然終わっていないのですが…無事終わると良いな…。
