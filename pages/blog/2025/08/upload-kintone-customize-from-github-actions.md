---
title: GitHub Actionsからkintoneカスタマイズのコードを自動アップロードする
description: GitHub Actionsを使って、kintoneをカスタマイズするJavaScript/CSSのコードを自動でアップロードするためのアクションを紹介します。これがあれば、git pushするだけでkintoneのカスタマイズが反映されるので、開発効率が大幅に向上します。
pubtime: 2025-08-24T22:59:00+09:00
tags: [kintone, GitHub, CI/CD]
---

[kintone](https://kintone.cybozu.co.jp/)はカスタマイズ性が高くてうれしいのですが、ブラウザ上でJavaScript/CSSファイルをアップロードしないといけないのが少し面倒です。
これを自動化するための[customize-uploader](https://cybozu.dev/ja/kintone/sdk/development-environment/customize-uploader/)というCLIツールが公式から提供されていますが、マニフェストファイルを作らないといけないので、本番環境と開発環境で分けた上でCI/CDを回すような大掛りな運用をすると少し工夫が必要になってしまいます。

そこで、GitHub Actionsから簡単にアップロードできるように「[macrat/upload-kintone-customize-action](https://github.com/marketplace/actions/upload-kintone-customize)」というアクションを作ってみました。
これを使えば、GitHubにコードをpushするだけでkintoneにカスタマイズが反映されるようにできるので、開発体験を大幅に改善できます。

この記事では、GitHubは使っているがGitHub Actionsは初めてくらいの方を対象に、このワークフローの作り方を解説します。


# 前提

ここでは、すでにGitHubリポジトリにkintoneカスタマイズのコードがあることを前提とします。

また、アップロードにあたってはユーザー名とパスワードを使った認証を行います。
oAuthトークンを使った認証やbasic認証にも対応していますが、ここでは割愛します。
すべてのオプションは[リポジトリのREADME](https://github.com/macrat/upload-kintone-customize-action/blob/main/README.md)に記載してありますので、そちらをご覧ください。


# 設定のやり方

## 1. GitHub Secretsにkintoneの情報を登録する

まずはじめに、GitHubリポジトリの**Settings** > **Secrets and variables** > **Actions**にkintoneの情報を登録します。
upload-kintone-customize-actionでは以下のような情報が必要です。

|名前|説明|
|---|---|
|`KINTONE_BASE_URL`|kintoneのベースURL (例: `https://example.cybozu.com`)|
|`KINTONE_APP_ID`|kintoneアプリのID|
|`KINTONE_USERNAME`|アップロードに使うアカウントのログインユーザー名|
|`KINTONE_PASSWORD`|アップロードに使うアカウントのログインパスワード|

BASE\_URLやAPP\_IDはワークフローに直接書くこともできますが、リポジトリを公開する場合は念のためSecretsに入れておいた方がよいかもしれません。
USERNAMEとPASSWORDは漏洩を防ぐために必ずSecretsに入れておきましょう。

## 2. GitHub Actionsのワークフローを作成する

次に、GitHub Actionsのワークフローを作成します。

以下の内容を`.github/workflows/upload.yml`という名前で保存します。
ファイル名の部分は任意ですが、`.yml`または`.yaml`で終わる必要があります。

```yaml
name: Upload kintone customize file

on:
  push:
    branches:
      - main  # mainブランチにpushされたら実行する

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Upload kintone customize file
        uses: macrat/upload-kintone-customize-action@v1
        with:
          base-url: ${{ secrets.KINTONE_BASE_URL }}
          username: ${{ secrets.KINTONE_USERNAME }}
          password: ${{ secrets.KINTONE_PASSWORD }}
          app-id: ${{ secrets.KINTONE_APP_ID }}
          desktop-js: ./dist/desktop.js
          desktop-css: ./dist/desktop.css
          mobile-js: ./dist/mobile.js
          mobile-css: ./dist/mobile.css
```

この例では、`main`ブランチにpushされたときにワークフローが実行されるようになっています。

`desktop-js`や`mobile-css`などのオプションには、アップロードしたいJavaScript/CSSファイルのパスを指定します。
必要ないものは省略できます。

## 3. ワークフローを実行する

準備ができたら、ワークフローを実行します。
といっても難しいことは何もなく、`main`ブランチにcommitしてpushするだけでで実行されます。

GitHubリポジトリの**Actions**タブで実行結果を確認してみてください。


# 高度な使い方

以上、これだけで基本の使い方はおしまいです。

以降では、上記以外の使い方をいくつかご紹介します。

## 複数のファイルをアップロードする

複数のファイルをアップロードしたい場合は、改行区切りで指定します。

```yaml
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Upload kintone customize file
        uses: macrat/upload-kintone-customize-action@v1
        with:
          base-url: ${{ secrets.KINTONE_BASE_URL }}
          username: ${{ secrets.KINTONE_USERNAME }}
          password: ${{ secrets.KINTONE_PASSWORD }}
          app-id: ${{ secrets.KINTONE_APP_ID }}
          desktop-js: |
            ./dist/desktop-1.js
            ./dist/desktop-2.js
          mobile-js: |
            ./dist/mobile-1.js
            ./dist/mobile-2.js
```

## アップロードの前にビルドする

WebpackやViteなどを使って開発している場合は、アップロードする前にビルドを行う必要があります。
そんなときは、以下のようにビルドステップを追加してください。

```yaml
jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      # ビルドに必要なもろもろをインストールする
      - uses: actions/setup-node@v4
        with:
          node-version: '24'
      - run: npm ci

      # ビルドする
      - run: npm run build

      - name: Upload kintone customize file
        uses: macrat/upload-kintone-customize-action@v1
        with:
          base-url: ${{ secrets.KINTONE_BASE_URL }}
          username: ${{ secrets.KINTONE_USERNAME }}
          password: ${{ secrets.KINTONE_PASSWORD }}
          app-id: ${{ secrets.KINTONE_APP_ID }}
          desktop-js: ./dist/desktop.js
          desktop-css: ./dist/desktop.css
          mobile-js: ./dist/mobile.js
          mobile-css: ./dist/mobile.css
```

ほかにも必要なコマンドがあれば、`- run: ...`を追加していけばOKです。

## ブランチによってアップロード先を変える

ブランチごとにアップロード先を変えたい場合は、**Environments**という機能が使えます。

GitHubリポジトリの**Settings** > **Environments**で、`development`や`production`などの環境を作成して、この記事の冒頭で紹介したのと同じ名前のSecretsを登録します。
production環境には本番環境のURLやアプリIDを、development環境には開発環境のURLやアプリIDを登録します。

次に、ワークフローファイルを以下のように書き換えます。

```yaml
name: Upload kintone customize file

on:
  push:
    branches:
      - main
      - dev  # devブランチにpushされたときも実行する

jobs:
  upload:
    runs-on: ubuntu-latest
    environment: ${{ github.ref == 'refs/heads/main' && 'production' || 'development' }}  # mainブランチならproduction環境、そうでなければdevelopment環境を使う
    steps:
      - uses: actions/checkout@v5

      - name: Upload kintone customize file
        uses: macrat/upload-kintone-customize-action@v1
        with:
          base-url: ${{ secrets.KINTONE_BASE_URL }}
          username: ${{ secrets.KINTONE_USERNAME }}
          password: ${{ secrets.KINTONE_PASSWORD }}
          app-id: ${{ secrets.KINTONE_APP_ID }}
          desktop-js: ./dist/desktop.js
          desktop-css: ./dist/desktop.css
          mobile-js: ./dist/mobile.js
          mobile-css: ./dist/mobile.css
```

`on.push.branches`で`dev`ブランチにpushされたときも実行されるようにして、`jobs.upload.environment`でブランチごとの**Environments**を指定しました。
これで、`main`ブランチか`dev`ブランチかによってアップロード先が切り替わります。


# まとめ

kintoneのカスタマイズをしているとアップロードがやや面倒ですが、この方法であれば管理がずっと簡単になるはずです。
設定もファイルを1つ作るだけで済むので、ぜひ試してみてください。
