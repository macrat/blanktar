---
title: docker-composeでfluentdとelasticsearch/kibanaを動かす
pubtime: 2018-09-19T20:45+0900
tags: [fluent, elasticsearch, kibana, docker-compose, docker, ログ]
---

最近自宅サーバの環境をモダンにする作業を進めています。
直接ホストで動かしてたデーモンをdockerに載せたり、ログを準リアルタイム的に解析出来るようにしたり。で、この記事はこのログの部分のメモです。

docker-comopseで立ち上げたコンテナのログを、[fluentd](https://www.fluentd.org)経由で[elasticsearch](https://www.elastic.co/jp/products/elasticsearch)に流し込みます。
本当はこの先[kibana](https://www.elastic.co/jp/products/kibana)で解析するのだけれど、この記事では扱いません。一応立てるだけ。

なお、ここで使ったファイル一式は[github](https://github.com/macrat/dockercompose-fluent-elasticsearch-kibana)にあります。

## fluentdのイメージを用意する
Docker Hubに[fluentdのイメージ](https://hub.docker.com/r/fluent/fluentd/)があるにはあるのですが、このままだとelasticsearchにoutputするためのプラグインが入っていません。
なので、[ドキュメント](https://github.com/fluent/fluentd-docker-image#3-customize-dockerfile-to-install-plugins-optional)を参考にしてDockerfileを作ります。

``` dockerfile
FROM fluent/fluentd

RUN apk add --update --virtual .build-deps sudo build-base ruby-dev \
 && sudo gem install fluent-plugin-elasticsearch \
 && sudo gem sources --clear-all \
 && apk del .build-deps \
 && rm -rf /var/cache/apk/* /home/fluent/.gem/ruby/2.4.0/cache/*.gem
```

こんな感じでおっけー。ファイル名は`./fluentd/Dockerfile`にしました。

## fluentdの設定ファイルを書く
イベージが出来たら、それ用の設定ファイルを書きます。コンテナイメージの中にCOPYしなかったのはちょこちょこ弄りたいから。
ここでは、elasticsearchのコンテナの名前はそのまんま`elasticsearch`ということにしておきます。

最小限の内容だと以下のような感じ。受け取った内容をそのまんまfluentdに流すだけ。
githubのやつは標準出力にも出すようにしてあります。お好みで。

``` xml
<source>
    @type forward
    port 24224
</source>

<match **>
    @type elasticsearch
    host elasticsearch
    port 9200
    logstash_format true
    logstash_prefix fluent.${tag}
</match>
```

どこに置いても良いのですが、とりあえず`./fluentd/fluentd.conf`にしました。

# ひと通り立ち上げてみる
[elasticsearch](https://hub.docker.com/r/_/elasticsearch/)と[kibana](https://hub.docker.com/r/_/kibana/)についてはオフィシャルのリポジトリをそのまま使えるので使います。バージョン古いっぽいけど、まあ良いでしょう。

とりあえず立ち上げるだけのdocker-composeは以下のような感じになります。ファイル名は`./docker-compose.yml`で。

``` yaml
version: '3'

services:
    fluentd:
        build: ./fluentd

        volumes:
            - ./fluentd/fluentd.conf:/fluentd/etc/fluentd.conf:ro

        ports:
            - 24224:24224

        environment:
            FLUENTD_CONF: fluentd.conf

    elasticsearch:
        image: elasticsearch

        depends_on:
            - fluentd

    kibana:
        image: kibana

        ports:
            - 5601:5601

        depends_on:
            - elasticsearch
```

ファイルが出来たら、普通に起動します。

``` bash
$ docker-compose up -d
```

この状態で[localhost:5601](http://localhost:5601)にアクセスするとkibanaが開いて色々見れるはず。
ただ、このままだとログも何も流れてこないのでさびしい。

## コンテナのログをfluentdに流す
いよいよ本題。コンテナが吐き出すログを全部fluentdに流して、elasticsearchに保存します。

`./docker-compose.yml`を書き換えて、以下のような感じに。

``` yaml
version: '3.4'

x-logging:
    &default-logging
    driver: fluentd
    options:
        fluentd-address: localhost:24224
        tag: "log.{{.Name}}"

services:
    fluentd:
        build: ./fluentd

        volumes:
            - ./fluentd/fluentd.conf:/fluentd/etc/fluentd.conf:ro

        ports:
            - 24224:24224

        environment:
            FLUENTD_CONF: fluentd.conf

    elasticsearch:
        image: elasticsearch

        depends_on:
            - fluentd
        logging: *default-logging

    kibana:
        image: kibana

        ports:
            - 5601:5601

        depends_on:
            - elasticsearch
        logging: *default-logging
```

変更は以下の三点です。

1. versionが3から3.4になった
2. x-loggingってのが増えた
3. elasticsearchとkibanaのサービスに`logging: *default-logging`が増えた。

実際のところ3番だけでよくて、1と2は何度も同じことを書かなくてよくするためにやっています。Extension Fieldと言うらしい。
versionを変えたくない場合は`logging:`以下にx-loggingの内容（`&default-logging`以外）を書けばおっけーです。

ちなみに、`x-logging.options.tag`の部分に`.Name`（コンテナの名前が入る）とかいうのを使ってますが、この部分は他にも色々使えるみたいです。dockerのドキュメントに[tagに使える変数のリスト](https://docs.docker.com/config/containers/logging/log_tags/)が載ってるので参考にどうぞ。

この状態でもう一回起動すると、elasticsearchにがしがしログが追記されていくはずです。
ログのタグは`fluent.log.(コンテナ名)-YYYY-MM-DD`になっているはず。

このままだとメッセージが全てテキストとして入ってしまって使い勝手が悪いのですが、上手くフィルタ（？）を書いてあげればパースすることも出来るみたいです。

きちんと設定してあげるとかなり快適かつ漏れ無くに監視出来るようになりそうな気がします。素敵。

---

### 参考：
- [docker fluentd logging driver の基礎的な設定 - Qiita](https://qiita.com/moaikids/items/8a8ee90e163f14e6e923)
- [docker-compose 3.4から追加されたExtension Fieldを使ってdocker-compose.yml でアンカー エイリアスを使う - Qiita](https://qiita.com/kyusyukeigo/items/af20487162ff0a1a6cea)
