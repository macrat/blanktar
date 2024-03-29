---
title: raspberry Pi/golangで温湿度センサ（HDC1000）を読んでfluentdに流す温度・湿度ロガー作った話
pubtime: 2018-09-27T20:37:00+09:00
tags: [Linux, Go言語, Fluentd, ライブラリの紹介, ハードウェア]
image: [/blog/2018/09/raspberrypi-zero-temperature-humidity-logger.jpg]
description: go言語を使ってraspberry Piに付けた温湿度センサ（HDC1000）の値を読み取ってみました。読み取ったデータはfluentdに流して記録しています。
howto:
  totalTime: PT10M
  supply:
    - 温湿度センサ（HDC1000）
  tool:
    - Raspberry Pi
    - go言語の環境
    - github.com/macrat/go-i2c
    - github.com/fluent/fluent-logger-golang
  step:
    - name: 回路を組む
      text: ユニバーサル基板を使って、I2Cで接続します。
      url: "#作ったもの（物理）"
      image: /blog/2018/09/raspberrypi-zero-temperature-humidity-logger.jpg
    - name: データを取得する
      url: "#HDC1000のデータをgolangで読む"
      text: |
        go-i2cライブラリを使ってデータを取得します。
        0x00に書き込むと、温度と湿度をまとめて取得することが出来ます。
        取得したデータはデータシートに従って計算すると、摂氏とパーセントにそれぞれ変換出来ます。
    - name: fluentdにデータを送る
      url: "#golangからfluentdにデータを送る"
      text: |
        fluent公式のfluent-logger-golangライブラリを使って、fluentdにデータを送信します。
        PostWithTimeを使って送信することで、"@timestamp"が自動的に付与されます。
---

私の部屋には温度と湿度を取れるセンサ（HDC1000ってやつ）が付いたラズパイが置いてあって、5分置きにデータをsqliteに記録するようになっています。今のところただ見れるだけなんですが、いずれエアコンとかと連動させたい。
で、最近fluent/elasticsearchを使っていこうぜというマイブームが起きている（[先日の記事とか](/blog/2018/09/docker-compose-fluent-elasticsearch)）ので、この温湿度の記録もelasticsearchでやるようにしようかと。
さらに、折角fluent使うなら複数のホストから取ってがしがし流したいよねということで、Raspberry Pi Zero Wを使ったやつを一台増設してみました。

# 作ったもの（物理）
あたらしく作ったのがこんな感じのやつ。

![HDC1000を載せたRaspberry Pi Zero W](/blog/2018/09/raspberrypi-zero-temperature-humidity-logger.jpg "640x480")

pHATのユニバーサル基板載っけてI2Cの線を繋いだだけです。超簡単。
一応熱の影響を考えて、プロセッサとかSDカードが刺さってる場所からは離して設置してみました。どのぐらい効果があるかは測ってません。多分気持ちの差。

センサがぴょこんと出ててダサいので、いつかプリント基板発注してチップだけのやつ載せてみたい。
[RSコンポーネンツ](https://jp.rs-online.com/web/c/semiconductors/sensor-ics/temperature-humidity-sensors/)で湿度センサとか見てるとチップだけのが色々あって妄想が膨らみます。…まあ、こんなん買ってもハンダ付けられる気がしないですが。


# HDC1000のデータをgolangで読む
HDC1000はI2Cでデータを取得出来ます。今回はgo言語から使いたかったので、[go-i2c](https://github.com/d2r2/go-i2c)というライブラリを使いました。
ただこのライブラリ、ctrl-Cで止められないとかログを消せないとか色々挙動がアヤシかったので[フォークしたやつ](https://github.com/macrat/go-i2c)を使ってます。

温度と湿度を読み取るコードは以下のような感じ。

``` go
package main

import (
    "encoding/binary"
    "fmt"

    "github.com/macrat/go-i2c"
)

var (
    HDC1000_ADDRESS = 0x40
    I2C_BUS         = 1
)

func GetTemperatureAndHumidity() (float64, float64) {
    bus, err := i2c.NewI2C(HDC1000_ADDRESS, I2C_BUS)

    if _, err := bus.WriteBytes([]byte{0x00}); err != nil {
        panic(err.Error())
    }

    time.Sleep(13 * time.Millisecond)

    data := make([]byte, 4)
    if _, err := bus.ReadBytes(data); err != nil {
        panic(err.Error())
    }

    temperature := float64(binary.BigEndian.Uint16(data[:2]))/float64(0xFFFF)*165.0 - 40.0
    humidity := float64(binary.BigEndian.Uint16(data[2:])) / float64(0xFFFF)

    return temperature, humidity
}

func main() {
    temperature, humidity := GetTemperatureAndHumidity()

    fmt.Printf("temperature: %dc humidity: %f%%\n", temperature, humidity * 100.0)
}
```

起動時はデフォルトで温度と湿度をまとめて取れるモードになっているので、これを利用しています。コードが短かくて良い感じ。
個別に取りたいなら設定用のレジスタ(0x02)を弄ればモードを変えられるみたい。

# golangからfluentdにデータを送る
取れたデータを今度はfluentdに流し込みます。これは[fluent公式のクライアント](https://github.com/fluent/fluent-logger-golang/)が便利。

``` go
package main

import (
    "time"

    "github.com/fluent/fluent-logger-golang/fluent"
)

var (
    FLUENT_HOST = "localhost"
    FLUENT_PORT = 24224
    TAG         = "tag.of.temperature-and-humidity"
)

func main() {
    f := fluent.New(fluent.Config{
        FluentHost: FLUENT_HOST,
        FluentPort: FLUENT_PORT,
    })

    temperature, humidity := GetTemperatureAndHumidity()

    f.PostWithTime(TAG, time.Now(), map[string]interface{}{
        "temperature": temperature,
        "humidity": humidity,
    })
}
```

これだけ。`PostWithTime`を使っておけば`@timestamp`もきちんと記録されます。良い感じ。

# 折角なのできちんと作った
ほんとにこれだけだとちょっと寂しいので、[ちゃんと拡張性がある感じのもの](https://github.com/macrat/doma_logger)を作ってみました。
Prometheus経由でもっとリアルタイム性の高い記録が出来たり、保存先やらセンサの追加がやりやすかったりします。多分。
今後プラグインで拡張したり設定ファイルでどのセンサ使うか選べるようにしたい。…モチベーションが上がれば。
