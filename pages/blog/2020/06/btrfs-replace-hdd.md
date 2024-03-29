---
title: RAID5なbtrfsのHDDをreplaceした話
pubtime: 2020-06-17T19:53:00+09:00
tags: [Linux, Btrfs, ストレージ]
description: btrfsで作ったRAIDディスクアレイのHDDが怪しい挙動をしていたので、新しいHDDに交換しました。まだマウント出来る状態のHDDを新しいものに置き換えて、ついでに容量を大きくする方法のメモです。
howto:
  name: btrfsで作ったRAID5のHDDを交換する方法
  tool: [btrfsコマンド, 時間的な余裕（結構掛かります）]
  supply: [新しいHDD]
  step:
    - name: 新しいHDDを繋ぐ
      text: まずは新しいHDDを繋ぎます。まだ読めるデータをコピーするのに使うので、古いHDDは繋いだままにします。
      url: "#新しいHDDを接続する"
    - name: 古いHDDから新しいHDDにデータをコピーする
      text: "`btrfs replace`コマンドを使って、古いHDDにあるまだ読めるデータを新しいHDDにコピーします。結構時間が掛かります。"
      url: "#古いHDDから新しいHDDにデータをコピーする"
      image: /blog/2020/06/btrfs-replace-hdd-step2.png
    - name: エラーカウントをリセットする
      text: "`btrfs device stats`にエラーの回数が記録されたままになっているので、これを`device stats --reset`でリセットします。"
      url: "#エラーカウントをリセットしておく"
      image: /blog/2020/06/btrfs-replace-hdd-step3.png
    - name: （必要な場合のみ）HDDの容量が増えたことをbtrfsに伝える
      text: "古いHDDよりも新しいHDDの方が容量が多い場合でも、btrfsは増えた分を勝手に使ってくれたりはしません。なので、`btrfs filesystem resize`で増えた分を使うようにbtrfsに伝えてあげます。"
      url: "#容量の大きいHDDに交換した場合"
      image: /blog/2020/06/btrfs-replace-hdd-step4.png
---

btrfsで作ったディスクアレイのHDDを交換したので、やり方のメモです。
前に書いた[完全にディスクが死んでいる場合の記事](/blog/2017/10/btrfs-replace-broken-hdd)とは違って、今回は一応マウント出来る状態での交換です。


# 故障の発見 / 状況を確認する

なんだかやたらとファイルサーバへのアクセスが遅くなっていたので調べてみたところ、dmesgに以下のようなエラーが大量に記録されていました。

``` shell
$ sudo dmesg
[17415.702324] BTRFS info (device sdf): read error corrected: ino 1 off 60428511150080 (dev /dev/sdd sector 3575050240)
[17415.718786] BTRFS info (device sdf): read error corrected: ino 1 off 60428511154176 (dev /dev/sdd sector 3575050248)
[18003.357383] BTRFS warning (device sdf): sdf checksum verify failed on 60428489015296 wanted 65315BEF found CDF7F87E level 0
[18112.286563] BTRFS warning (device sdf): sdf checksum verify failed on 60428489015296 wanted 65315BEF found CDF7F87E level 0
[29995.452458] BTRFS error (device sdf): bad tree block start 7611175298055105740 60427922653184
[29995.465097] BTRFS error (device sdf): bad tree block start 7611175298055105740 60427922866176
```

うーん、`/dev/sdd`が死にそう。

`device stats`にもエラーが記録されていました。

``` shell
$ sudo btrfs device stats /mnt/data
... 省略 ...
[/dev/sdd].write_io_errs    0
[/dev/sdd].read_io_errs     0
[/dev/sdd].flush_io_errs    0
[/dev/sdd].corruption_errs  58650
[/dev/sdd].generation_errs  0
... 省略 ...
```

死にそうではあるのですが、degradedオプションを付けなくてもマウント出来る状態です。
`btrfs scrub`とかやっても一応読めている（でもdmesgに大量にエラーが出る）みたいでした。
瀕死だけど死んでない。

この「degraded付けなくてもマウント出来る」状態であれば、この記事の方法を使うことが出来ます。

もしもdegradedオプションを付けないとエラーが出てマウント出来ないような場合は、以下の記事の方法を試してみてください。<br />
[btrfsで作ったRAIDのHDDが壊れた。ので、交換した。](/blog/2017/10/btrfs-replace-broken-hdd)


# 新しいHDDを接続する

新しいHDDが届いたら、通常通りPCに接続します。

今回はreplaceを使うので、壊れかけの古いHDDも繋いだままにしておきます。


# 古いHDDから新しいHDDにデータをコピーする

接続出来て動作することが確認出来たら、以下のコマンドでreplaceを開始します。

``` shell
$ sudo btrfs replace start /dev/sdd /dev/sdg /mnt/data
```

ここでは、`/dev/sdd`が古いディスク、`/dev/sdg`が新しいディスクで、`/mnt/data`がマウント先になっています。


# 状況を確認しながら待つ

以下のコマンドで進捗状況を確認することが出来ます。

``` shell
$ sudo btrfs replace status /mnt/data
0.0% done, 0 write errs, 0 uncorr. read errs
```

めちゃくちゃ時間が掛かるので、のんびり待つと良いと思います。
といっても`add`して`remove`する時よりも速いし進捗も見やすいので、比較的待つのは辛くない感じがあります。

コピーが完了すると、`replace status`の結果が以下のように変わります。

``` shell
$ sudo btrfs replace status /mnt/data
Started on 13.Jun 19:17:06, finished on 15.Jun 23:25:21, 0 write errs, 0 uncorr. read errs
```

これで、HDDの置き換えは完了です。
古いHDDを外して処分しましょう。


# エラーカウントをリセットしておく

今回の例だと`/dev/sdd`を交換しましたが、これだけだと`device stats`に記録されたエラーはそのままになっています。
そうなると今後エラーを見つけられなくて困るので、カウントをリセットしておきましょう。

``` shell
$ sudo btrfs device stats --reset /mnt/data
... 省略 ...
[/dev/sdd].write_io_errs    0
[/dev/sdd].read_io_errs     0
[/dev/sdd].flush_io_errs    0
[/dev/sdd].corruption_errs  58650
[/dev/sdd].generation_errs  0
... 省略 ...
```

もう一回`stats`を見てみると、綺麗に消えているはずです。

``` shell
$ sudo btrfs device stats /mnt/data
... 省略 ...
[/dev/sdd].write_io_errs    0
[/dev/sdd].read_io_errs     0
[/dev/sdd].flush_io_errs    0
[/dev/sdd].corruption_errs  0
[/dev/sdd].generation_errs  0
... 省略 ...
```

これで次にエラーが起きたときも分かりやすくて安心。


# 容量の大きいHDDに交換した場合

HDDの交換が完了した後で`device usage`を見てみると、以下のようになっていました。

``` shell
$ sudo btrfs device usage /mnt/data
... 省略 ...

/dev/sdf, ID: 6
   Device size:             2.73TiB
   Device slack:              0.00B
   Data,RAID10:             2.68TiB
   System,RAID1:           32.00MiB
   Unallocated:            47.49GiB

/dev/sdg, ID: 7
   Device size:             5.46TiB
   Device slack:            1.82TiB
   Data,RAID10:             3.57TiB
   Metadata,RAID1:         14.00GiB
   System,RAID1:           64.00MiB
   Unallocated:            53.96GiB
```

ずっと繋いでいる`/dev/sdf`（3TB）は`Device slack`が0Bなのですが、今回追加した`/dev/sdg`（4TBから6TBに増やした）は`Device slack`が2TBになっています。

単純に容量の大きいストレージを繋いだだけだと、余剰扱いになってしまって使ってくれないみたいです。

なので、以下のコマンドでフルに使って良いことをbtrfsに伝えます。

``` shell
$ sudo btrfs filesystem resize 7:max /mnt/data
Resize '/mnt/data' of '7:max'
```

ここで書いている`7`はさっきの`device usage`で見れるIDの番号です。

このコマンドはわりとすぐ終わります。
終わったら、以下のような感じでフルに使えるようになっているはず。

``` shell
$ sudo btrfs device usage /mnt/data
... 省略 ...

/dev/sdf, ID: 6
   Device size:             2.73TiB
   Device slack:              0.00B
   Data,RAID10:             2.68TiB
   System,RAID1:           32.00MiB
   Unallocated:            47.49GiB

/dev/sdg, ID: 7
   Device size:             5.46TiB
   Device slack:              0.00B
   Data,RAID10:             3.57TiB
   Metadata,RAID1:         14.00GiB
   System,RAID1:           64.00MiB
   Unallocated:             1.87TiB
```

この時点ではデータが偏って配置されてしまっているので、最後に`balance`を実行してあげましょう。（これが時間掛かる…）

``` shell
$ sudo btrfs balance start --bg --full-balance /mnt/data
```

これも、適当に状況を見ながら待ちます。

``` shell
$ sudo btrfs balance status /mnt/data
Balance on '/mnt/data' is running
1 out of about 3674 chunks balanced (2 considered), 100% left
```

---

参考: [btrfs wikiに書いてないハマりどころメモ (RAID5障害・拡張) - Qiita](https://qiita.com/ko-zu/items/49c54609df2e2cb36419)
