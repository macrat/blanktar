---
title: Instagram graph API v6で投稿した画像を取得する
pubtime: 2020-02-07T16:21:00+09:00
tags: [Web, API]
description: 仕事でInstagramの投稿をホームページに取り込みたいという案件があったので、Instagram graph APIというのを使ってFacebookのAPIを使ってみました。結構ややこしいです。
---

Instagramの投稿をホームページに取り込みたいという案件があったので、[Instagram graph API](https://developers.facebook.com/docs/instagram-api/)を試してみました。

使用したのは __v6.0__ のAPIです。バージョンによっては挙動が違うかもしれません。


# 前提条件

- [Instagramをプロアカウントに設定](https://www.facebook.com/help/instagram/502981923235522)してあること
- [Facebookページ](https://www.facebook.com/help/104002523024878)を作成してあること
- [FacebookページとInstagramのアカウントを連携](https://www.facebook.com/help/1148909221857370)してあること


# 全体の流れ

Instagramアカウントの投稿を取得するためには、以下のような道のりを辿る必要があります。

1. Facebookアカウントのアクセストークンを取得する
2. アカウントに紐付けられている、Facebookページのアクセストークンを取得する
3. Facebookページに紐付けられている、Instagramのアカウントを見つける
4. Instagramのアカウントに紐付けられている投稿を取得する


# 1. Facebookアプリを作る

[Facebook for developers](https://developers.facebook.com/)で開発者として登録し、facebookアプリを作成します。
作成時に確認できる __アプリID__ と __app secret__ を控えておいてください。


# 2. アクセストークンを発行する

FacebookのAPIで用いるアクセストークンには、いくつかの種類があるようです。
今回は、[ユーザーアクセストークン](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens)と、[ページアクセストークン](https://developers.facebook.com/docs/pages/access-tokens)の2種類を使用します。

ユーザーアクセストークンには有効期限の違う[短期トークンと長期トークン](https://developers.facebook.com/docs/facebook-login/access-tokens#termtokens)というものがあるので、この記事では全部で3種類のトークンが登場します。

## 2-1. 短期トークンを作る

まず最初に、[グラフAPIエクスプローラ](https://developers.facebook.com/tools/explorer/)を用いて、寿命が1時間程度の __ユーザーアクセストークン__ というものを取得します。
「Get Access Token」 とか 「トークンを取得」 といった名前のボタンがあるはずです。

このとき、欲しいアクセス許可（パーミッション）を選ぶことが出来ます。
この記事で使用するのは、以下の3つです。

- `public_profile`: 必ず付与されます
- `pages_show_list`: ページの一覧を取得するのに必要です
- `instagram_basic`: Instagramの情報にアクセスするのに必要です

作成したトークンの寿命や与えられているパーミッションについては、[アクセストークンデバッガー](https://developers.facebook.com/tools/debug/accesstoken/)を用いることで確認できます。

## 2-2. 長期トークンを作る

次に、以下のAPIを使用して60日間程度の有効期限がある長期トークンを発行します。

``` shell
$ curl "https://graph.facebook.com/v6.0/oauth/access_token?grant_type=fb_exchange_token&client_id=$APPLICATION_ID&client_secret=$APP_SECRET&fb_exchange_token=$SHORT_TOKEN"
{
  "access_token": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdfeghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  "token_type": "bearer",
  "expires_in": 1234567
}
```

`$SHORT_TOKEN` が先程取得した短期トークンです。
`$APPLICATION_ID` と `$APP_SECRET` については、Facebookアプリを作成した際に控えた値を入れてください。

## 2-3. ページアクセストークンを作る

最後に、以下のAPIで寿命のない __[ページアクセストークン](https://developers.facebook.com/docs/pages/access-tokens)__ というものを取得します。

投稿を取得する際に使用するアクセストークンは、このページアクセストークンになります。

``` shell
$ curl "https://graph.facebook.com/v6.0/me/accounts?fields=access_token,name&access_token=$LONG_TOKEN"
{
  "data": [
    {
      "access_token": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdfeghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEF",
      "name": "Facebookページの名前",
      "id": "012345678901234"
    }
  ],
  "paging": {
    "cursors": {
      "before": "ABCDEFGHIJKLMNOPQRST",
      "after": "ABCDEFGHIJKLMNOPQRST"
    }
  }
}
```

`$LONG_TOKEN` は2-2で作成した長期トークンが入ります。

いくつかFacebookページを持っている場合は、そのページの分だけ結果が返ってくるようです。
その場合は、Instagramアカウントを紐付けてあるFacebookページの`access_token`を使用してください。


# 3. IG User IDを取得する

Instagramから情報を取得するためには、そのアカウントを特定するための __[IG User](https://developers.facebook.com/docs/instagram-api/reference/user/)のID__ が必要です。
IG User IDは、以下のAPIで取得できます。

``` shell
$ curl "https://graph.facebook.com/v6.0/me?fields=instagram_business_account&access_token=$PAGE_TOKEN"
{
  "instagram_business_account": {
    "id": "01234567890123456"
  },
  "id": "012345678901234"
}
```

`$PAGE_TOKEN` には2-3で作成したページアクセストークンを入れてください。

`instagram_business_account` の中にある `id` が、 __IG User ID__ です。


# 4. Instagramの投稿を取得する

最後に、ここまでで取得した情報を用いてInstagramに行った投稿を取得します。

ユーザのプロフィールは[IG User API](https://developers.facebook.com/docs/instagram-api/reference/user)で、今までの投稿などは[IG Media API](https://developers.facebook.com/docs/instagram-api/reference/media)でそれぞれ取得することが出来ます。

試しに、今までに行った投稿のキャプションと画像へのURLを取得してみます。

``` shell
$ curl "https://graph.facebook.com/v6.0/$IG_USER_ID/media?fields=caption,media_url&access_token=$PAGE_TOKEN"
{
  "data": [
    {
      "media_url": "画像へのURL",
      "caption": "投稿に付けられたキャプション",
      "id": "01234567890123456"
    },
    {
      "media_url": "画像へのURL",
      "caption": "投稿に付けられたキャプション",
      "id": "01234567890123456"
    },
    {
      "media_url": "画像へのURL",
      "caption": "投稿に付けられたキャプション",
      "id": "01234567890123456"
    },
    ...
  ],
  "paging": {
    "cursors": {
      "before": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678",
      "after": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFG"
    },
    "next": "続きを取得するためのAPIエンドポイントのURL"
  }
}
```

`$IG_USER_ID` は、先程取得した __IG User ID__ が入ります。

これで念願の投稿画像が手に入りました！

件数に制限を付けたい場合は、 `limit` というクエリを追加して、以下のようにします。

``` shell
$ LIMIT=2
$ curl "https://graph.facebook.com/v6.0/$IG_USER_ID/media?fields=caption,media_url&limit=$LIMIT&access_token=$PAGE_TOKEN"
{
  "data": [
    {
      "media_url": "画像へのURL",
      "caption": "投稿に付けられたキャプション",
      "id": "01234567890123456"
    },
    {
      "media_url": "画像へのURL",
      "caption": "投稿に付けられたキャプション",
      "id": "01234567890123456"
    }
  ],
  "paging": {
    "cursors": {
      "before": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz012345678",
      "after": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ABCDEFG"
    },
    "next": "続きを取得するためのAPIエンドポイントのURL"
  }
}
```
