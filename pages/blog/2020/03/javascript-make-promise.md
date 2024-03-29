---
title: JavaScriptでコールバックな関数をPromise化する
pubtime: 2020-03-27T20:40:00+09:00
tags: [JavaScript, 言語仕様]
description: Promiseに対応していなくてコールバック関数を渡さないといけないJavaScriptの関数を、async/awaitで呼び出せるようにPromise化する方法です。
faq:
  - question: Promiseに対応していないJavaScriptの関数をasync/awaitで使うには？
    answer: Promiseクラスのコンストラクタを使うと、コールバック関数を使ってPromiseを作ることが出来ます。
---

最近のJavaScriptのライブラリはasync/awaitに対応していることが多くなってきました。
おかげで、かなり短かいコードで非同期処理が実現出来るようになっています。

とはいえ、まだまだ非対応のライブラリもあり、混ざってしまった日にはコードが酷いことに…。
というわけで、コールバック関数を渡さないといけない古いスタイルのライブラリを、Promiseでラッピングしてasync/await出来るようにする方法です。


# 対応前のコード
対応前のコードのイメージは、以下のようなものです。
これを、Promiseを使って綺麗にしていきます。

``` javascript
database.get((data, error) => {
    if (error) {
        console.error(error);
        return;
    }

    database.set(data + 1, error => {
        if (error) {
            console.error(error);
        }
    });
});
```

データベースから何かの数値を持ってきて、値を加算して格納する、という雰囲気で書いてみたものです。
内容は単純ですが、コールバックが入れ子になってしまって見通しはかなり悪めです…。


# Promise化するコード
先ほどのサンプルで使った`database.get`と`database.set`をPromiseで包むためには、以下のようなコードを書くことになります。

``` javascript
function getData() {
    return new Promise((resolve, reject) => {  // Promiseのコンストラクタを使って「resolve」と「reject」を作る
        database.get((data, error) => {
            if (!error) {
                resolve(data);  // 処理が終わったら、「resolve」に戻り値を渡す
            } else {
                reject(error);  // 処理に失敗したときは、「reject」にエラーの内容を渡す
            }
        });
    });
}

function setData(data) {
    return new Promise((resolve, reject) => {
        database.set(data, error => {
            if (!error) {
                resolve();  // 返すべき戻り値が無いのであれば、引数を渡さずに「resolve」を呼び出す
            } else {
                reject(error);
            }
        });
    });
}
```


# 対応後のコード
Promiseでラッピングした`getData`と`setData`を使うと、[先ほどの長いコード](#対応前のコード)は以下のように短く書くことが出来るようになります。

``` javascript
getData()
    .then(data => setData(data + 1))
    .catch(error => console.error(error));
```

async/awaitを使う場合は以下のようになります。こちらの方が直感的ですね。

``` javascript
try {
    const data = await getData();
    await setData(data + 1);
} catch(error) {
    console.error(error);
}
```
