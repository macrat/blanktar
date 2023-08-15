---
title: swift使ってEddystone-URLを受信するiOSアプリを作った
pubtime: 2017-02-07T01:06:00+09:00
amp: hybrid
tags: [Swift, Eddystone-URL, iOS, BLE, アプリ]
description: swiftを使って、Eddystoneが発信するBluetoothペリフェラルを受信してEddystone-URLをパースするiOSアプリを作りました。Eddystone-URLのパースは自前で実装しています。
---

アプリを作っています。Eddystone-URLを受信するアプリです。
iOSだとどうにも情報が無くて。そしてswiftはバージョンにころころ変わるらしく。ちくしょうという感じです。

swiftは何にも分からないので、あまりエレガントなコードではないと思いますが、よしなに。

検証した端末はiPhone 6S、iOS 10.2.1(14D27)。Base SDKはiOS 10.2です。
swiftのバージョンは3.0.2です。swiftlang-800.0.63 clang-800.0.42.1らしいです。
バージョン問題に悩まされたのでとことん書きます。ちくしょうという感じです。

で、とりあえずメイン部分。ViewController.swiftに書くやつ。
``` swift
import UIKit
import CoreBluetooth


class ViewController: UIViewController, CBCentralManagerDelegate {
    var centralManager: CBCentralManager!

    override func viewDidLoad() {
        super.viewDidLoad()

        centralManager = CBCentralManager(delegate: self, queue: nil)  // 初期化する。スキャンの開始はcentralManagerDidUpdateStateの中で。
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)

        centralManager.stopScan()  // 画面から消えたらスキャンを停止する。
    }

    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        if central.state == CBManagerState.poweredOn {  // 超重要。理由は後述。
            print("start scan")

            // スキャン開始
            central.scanForPeripherals(withServices: [CBUUID(string: "FEAA")],
                                       options: [CBCentralManagerScanOptionAllowDuplicatesKey : true])
        } else {
            print("not ready")
        }
    }

    @objc(centralManager:didDiscoverPeripheral:advertisementData:RSSI:) func centralManager(_ central: CBCentralManager,
                                                                                            didDiscover peripheral: CBPeripheral,
                        advertisementData: [String : Any],
                        rssi RSSI: NSNumber) {

        if let serviceData = advertisementData[CBAdvertisementDataServiceDataKey] as? [NSObject : AnyObject] {
            let data = serviceData[CBUUID(string: "FEAA")]

            let es: EddystoneURL  // パースして良い感じにするクラス。自作した。後述。
            do {
                try es = EddystoneURL(RawData: data as! NSData)
            } catch {
                return
            }

            print("data: \(es)")
        }
    }
}
```

超重要ってコメントで書いた部分が超重要です。[iOS 8あたりから必要になったらしい](http://developer.iotdesignshop.com/tutorials/corebluetooth-and-the-beaconmanager-app/)です。
ググって出てくるサンプルを見ているとこのif文無しでやっているのですが、そうすると以下のようなエラーが出ます。
```
[CoreBluetooth] API MISUSE: <CBCentralManager: 0x17426af00> can only accept this command while in the powered on state
```
CBCentralManagerのstateってやつを確認して、poweredOnであることを確認してからスキャンを開始するようにすれば問題ありません。

で、BLEのペイロード部分のパースは次のクラスで。基本的には[公式の仕様](https://github.com/google/eddystone/tree/master/eddystone-url)に従ってひたすら実装しただけのやつです。
``` swift
import Foundation

class Eddystone : NSObject {
    static let URLEncodings: [UInt8: String] = [0x00: "http://www.",
                                                0x01: "https://www.",
                                                0x02: "http://",
                                                0x03: "https://"]

    static let DomainExpansions: [UInt8: String] = [0x00: ".com/",
                                                    0x01: ".org/",
                                                    0x02: ".edu/",
                                                    0x03: ".net/",
                                                    0x04: ".info/",
                                                    0x05: ".biz/",
                                                    0x06: ".gov/",
                                                    0x07: ".com",
                                                    0x08: ".org",
                                                    0x09: ".edu",
                                                    0x0a: ".net",
                                                    0x0b: ".info",
                                                    0x0c: ".biz",
                                                    0x0d: ".gov"]

    var TxPower: Int8
    var url: String


    init(RawData data: NSData) throws {
        var bytes = [UInt8](repeating: 0, count: data.length)
        data.getBytes(&bytes, length: data.length)

        // 1バイト目はFrame Specification。Eddystone-URLしか扱わないので、0x10で固定。
        if bytes[0] != 0x10 {
            throw NSError(domain: "it isn't EddystoneURL", code: -1, userInfo: nil)
        }

        // 2バイト目はTx Power Level。とりあえず保存しておく。
        TxPower = Int8(bitPattern: bytes[1])

        // 3バイト目はURL Scheme Prefix。
        if let t = Eddystone.URLEncodings[bytes[2]] {
            url = String(t)
        } else {
            throw NSError(domain: "invalid payload", code: -1, userInfo: nil)
        }

        // 4バイト目以降はURLのプレフィックスより後ろの部分。
        for i in 3..<data.length {
            // いくつかのドメインは1バイトに省略出来るらしい。
            if let t = Eddystone.DomainExpansions[bytes[i]] {
                url += String(t)
            } else {
                url += String(format: "%C", bytes[i])
            }
        }
    }

    override var description: String {
        return String(format: "EddystoneURL(power: %d): " + url, TxPower)
    }
}
```
愚直に実装しただけって感じです。

この二つのクラスを書いて実行してやると、デバッグコンソールに受信したEddystone URLのTx PowerとURLが表示されるはずです。
ご武運を。うへぇ。

---

参考：
- [google/eddystone: Specification for Eddystone, an open beacon format from Google](https://github.com/google/eddystone)
- [Google発のBeacon用オープンフォーマットEddystoneをAndroidで触ってみた - Qiita](http://qiita.com/chibatching/items/0cb0eaad42607a4f5754#eddystone-url)
- [Core Bluetooth and the Beacon Manager App | Iot Design Shop - Developer Portal](http://developer.iotdesignshop.com/tutorials/corebluetooth-and-the-beaconmanager-app/)
- [Eddystone と iOS - その2: 実装編 - Qiita](http://qiita.com/shu223/items/cf21c63b7b58b96bfbc0)
- [Core Bluetooth with Swift （ObjCのおまけ付き） - Qiita](http://qiita.com/shu223/items/78614325ce25bf7f4379)
