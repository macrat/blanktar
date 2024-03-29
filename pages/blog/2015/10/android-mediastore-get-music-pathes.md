---
title: AndroidのMediaStoreから端末内の音楽ファイルのパスを取得してみる
pubtime: 2015-10-29T15:09:00+09:00
tags: [Android, Java]
description: AndroidのMediaStoreを使って、Javaで端末内の音楽ファイルのフルパスを取得する方法です。非推奨の方法ですが、それなりに高速にちゃんと動きます。
---

[RuuMusic](http://ruumusic.blanktar.jp/)はディレクトリで音楽を整理する音楽プレイヤーなわけですが、この取得の処理が結構重いんですよね。IOは結構ヘビー。
細かい改良ではどうにもならなそうなので、Android標準の[MediaStore](http://developer.android.com/intl/ja/reference/android/provider/MediaStore.html)とやらを使ってみることにしました。というか、使ってみようと思います。
ちなみにMediaStoreでファイルシステム上のパスを取得するのは想定されていないようなので、この方法は**あんまりお勧めできません**。自己責任でどうぞ。

とりあえず必要なものをインポート。
``` java
import android.content.ContentResolver;
import android.provider.MediaStore;
import android.database.Cursor;

import android.util.Log;
```
余談ですが、パッケージのFQNを書いてないandroid関連の記事って多くないですか。調べるのめんどいから勘弁してほしい…。

で、とりあえず情報を取得します。
``` java
ContentResolver resolver = context.getContentResolver();
Cursor cursor = resolver.query(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, null, null, null, null);
```
リゾルバ作って、そいつに問い合わせ。わりとふつうのデータベースって感じです。
nullが並んでいるところでSQL風に色んな検索条件を指定できるので、いろいろ調べてみると幸せになれるかも。

取得できた項目の名前は以下のような感じで見れます。
``` java
for (String column: cursor.getColumnNames()) {
    Log.d("test", "column: " + column);
}
```

で、データを取得するには以下のような感じに。
``` java
cursor.moveToFirst();
do {
    Log.d("test", cursor.getString(cursor.getColumnIndex(MediaStore.Audio.Media.TITLE)));
} while(cursor.moveToNext());
```
ちょっと助長。この例だとタイトルの一覧を取得しています。
`cursor.moveToFirst`を忘れると例外が飛ぶので注意。

欲しいのはパスなわけですが、パスのカラム名は`_data`になっています。非推奨な感じが漂っています。でも使います。
``` java
cursor.moveToFirst();
do {
    Log.d("test", cursor.getString(cursor.getColumnIndex("_data")));
} while(cursor.moveToNext());
```
これでファイルパスの一覧がログに出力されます。やったね。

それなりに高速に動くのでうれしいのだけれど、ちょっとめんどう。

---

参考：
- [MediaStoreからある音楽ファイルの情報を取得する - 心魅 - cocoromi -](http://umezo.hatenablog.jp/entry/20100608/1276014215)
- [端末内の全画像(一部除く)パスを取得してみたよ - hyoromoのブログ](http://hyoromo.hatenablog.com/entry/20100109/1263046050)
