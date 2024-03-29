---
title: Fedora CoreOSのIgnitionでOSと一緒にdocker-composeのインストールもやる
pubtime: 2020-12-07T23:22:00+09:00
tags: [Fedora CoreOS, Linux, Docker, docker-compose]
description: ちょっとしたサービスを動かすにはdocker-composeが手軽で便利。コンテナを動かすだけのサーバを立てるにはFedora CoreOSが手軽で便利。でも、CoreOSはデフォルトではDockerが無効だしdocker-composeも入ってないし…という問題を解決するためのIgnitionファイルの書き方です。
faq:
  - question: Fedora CoreOSのIgnitionでrpm-ostreeのパッケージを入れるには？
    answer: （2020年12月時点では）Ignitionだけでは無理です。なので、systemdのConditionFirstBoot=yesを組み合わせて初回起動時にインストールするようにしましょう。
---

ちょっとしたサービスを動かしたいとき、docker-composeを使うと環境を丸ごとバージョン管理出来てかなり便利です。

では、そのサーバ環境を手軽に準備するにはどうしたら良いかというと…[Fedora CoreOS](https://getfedora.org/coreos?stream=stable)というコンテナ向けのOSを使うのが良いような気がします。

名前からなんとなく想像が付く通り、[CoreOSのContainer Linux](https://coreos.com/)をRedHatが買収して出来たものが**Fedora CoreOS**だそうです。
基本的には同じ路線なのですが、RedHatらしくrktでもDockerでもなくてPodman推しだったり、etcdとかflannelが無かったりと[細かい違いが色々](https://docs.fedoraproject.org/en-US/fedora-coreos/migrate-cl/)あります。

PodmanはPodmanで楽しいのですが、今回は手軽にdocker-composeでやりたい。
というわけで、CoreOSのインストール時の初期設定を担う[Ignitionファイル](https://docs.fedoraproject.org/en-US/fedora-coreos/producing-ign/)だけでDockerの有効化やdocker-composeのインストールをやるようにしてみました。


# そもそもIgnitionでパッケージは入れられない

しょっぱなから大問題なのですが、Ignitionは冪等で宣言的をウリにしているので、シェルコマンドを書いたりは出来ません。packages的な便利ディレクティブもありません。
今年の頭くらいに[シェルコマンドを書けるようにする提案](https://github.com/coreos/ignition/issues/909)が上げられていますが、2020年末時点で導入に向けた話は進んでいないみたいです。

というわけで回避方法として、[systemd-firstboot](https://wiki.archlinux.jp/index.php/Systemd-firstboot)的な仕組みを使うことにします。
systemdのUnitに`ConditionFirstBoot=yes`を設定しておくと初回起動時にしか実行されなくなる、みたいなやつですね。

成功したのか失敗したのか若干分かりづらいとか、インストールの進捗がさっぱり分からないとかそういう問題はありますが、とりあえず動くので良しとしておきます。
手間を惜しまずに分かりやすさを優先するならAnsibleとか使った方が良いかも。


# ともあれIgnitionファイルを作る

というわけでまずはIgnitionファイルを作ります。
このIgnitionファイルでdocker-composeをインストールするsystemd用のserviceを作って、そのserviceがdocker-composeをインストールしてくれる流れになります。

``` yaml
variant: fcos
version: 1.2.0

passwd:
  users:
    - name: core
      groups:
        - docker
      ssh_authorized_keys:
        - ssh-ed25519 AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA your@localhost

systemd:
  units:
    - name: docker.service
      enabled: true
    - name: install-docker-compose.service
      enabled: true
      contents: |
        [Unit]
        Description=Install docker-compose on first boot
        DefaultDependencies=no
        Conflicts=shutdown.target
        After=network-online.target
        Before=shutdown.target
        ConditionFirstBoot=yes

        [Service]
        Type=oneshot
        RemainAfterExit=no
        ExecStart=/usr/bin/rpm-ostree install -r docker-compose

        [Install]
        WantedBy=network-online.target
```

だいたい見たまんまです。
ポイントは以下の3点です。

- sudoせずにdockerを使いたいので、`passwd.users[].groups`で、`core`ユーザに`docker`グループを設定している。
- `systemd.units[]`で`docker.service`をenabledにしてDockerが自動起動するようにしている。
- 同じく`systemd.units[]`で`install-docker-compose.service`を追加して、docker-composeをインストールするようにしている。

`install-docker-compose.service`の中身は基本的には普通のサービスですが、[前述](#そもそもIgnitionでパッケージは入れられない)した`ConditionFirstBoot=yes`が付いているのが特徴でしょうか。
あとはなんか雰囲気で書いています。


# トランスパイルしてインストールする

ここは普通にFedora CoreOSをインストールするときと同じです。

以下は別のPCでやる準備。

``` bash
$ docker run -i --rm quay.io/coreos/fcct --strict <ignition.yml >ignition.json  # トランスパイルする
$ python -m http.server  # インストール対象のPCに配るためにHTTPサーバを立てる
```

で、以下がインストール対象のPCで[インストールディスク](https://getfedora.org/ja/coreos/download?tab=metal_virtualized&stream=stable)から起動したあとでやる作業。

``` bash
[core@localhost ~]$ sudo coreos-installer install /dev/sda --ignition-url http://10.0.0.1:8000/ignition.json --insecure-ignition
```

`10.0.0.1`の部分はHTTPサーバを立てているPCのIPアドレスで置き換えてください。

サーバを立てるのが面倒臭かったらUSBメモリか何かでコピーして以下の方法を使うのもアリ。

``` bash
[core@localhost ~]$ sudo coreos-installer install /dev/sda --ignition-file ./path/to/ignition.json
```

インストールが出来たら、PCを再起動します。


# docker-composeが入るのを見守る

PCが立ち上がってくると、ネットワークに繋がり次第docker-composeのインストールが始まるはずです。

この状態でSSHログインしてrpm-ostreeの様子を見てみると、おそらく以下のようになっているはず。

``` bash
[core@localhost ~]$ rpm-ostree status
State: busy
Transaction: install -r docker-compose 
  Initiator: client(id:cli dbus:1.11 unit:install-docker-compose.service uid:0)
Deployments:
● ostree://fedora:fedora/x86_64/coreos/stable
                   Version: 32.20201104.3.0 (2020-11-17T10:56:39Z)
                    Commit: 318de830c2f30a97333cd43aa1d500a46ccfedcb2de70a04d0c48228944346da
              GPGSignature: Valid signature by 97A1AE57C3A2372CCA3A4ABA6C13026D12C944D0
```

もしも`Transaction: install -r docker-compos`が表示されていなかったら、上手く`install-docker-compose.service`を起動出来ていないのかもしれません。
その場合は`systemctl status install-docker-compose.service`などでエラーログを見れるはずです。

ダウンロードやらインストールやらをやるのでしばらく時間が掛かりますが、それが終わると自動的に再起動が走ります。

再起動したら、ステータスが以下のようになっているはず。

``` bash
[core@localhost ~]$ rpm-ostree status
State: idle
Deployments:
● ostree://fedora:fedora/x86_64/coreos/stable
                   Version: 32.20201104.3.0 (2020-11-17T10:56:39Z)
                BaseCommit: 318de830c2f30a97333cd43aa1d500a46ccfedcb2de70a04d0c48228944346da
              GPGSignature: Valid signature by 97A1AE57C3A2372CCA3A4ABA6C13026D12C944D0
           LayeredPackages: docker-compose

  ostree://fedora:fedora/x86_64/coreos/stable
                   Version: 32.20201104.3.0 (2020-11-17T10:56:39Z)
                    Commit: 318de830c2f30a97333cd43aa1d500a46ccfedcb2de70a04d0c48228944346da
              GPGSignature: Valid signature by 97A1AE57C3A2372CCA3A4ABA6C13026D12C944D0
```

インストール完了。
これでDockerもdocker-composeも使えるようになっているはずです。
やったぜ。
