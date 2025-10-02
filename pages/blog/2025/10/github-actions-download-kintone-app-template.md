---
title: GitHub Actionsでkintoneアプリのテンプレートをダウンロードする
description: kintoneアプリをバックアップしたり配布したりするには、アプリテンプレート機能を使うと便利です。しかし、更新のたびに手動でダウンロードするのは面倒……ということで、GitHub Actionsを使って自動的にダウンロードする方法を紹介します。
pubtime: 2025-10-02T22:53:00+09:00
tags: [kintone, GitHub, CI/CD]
---

[kintone](https://kintone.cybozu.co.jp/)で作ったアプリは、「[アプリテンプレート](https://jp.cybozu.help/k/ja/app/setup/template/whats_template.html)」という機能でzipファイルにしてダウンロードできます。
このアプリテンプレートを使えば、アプリのフィールドやビューの設定をバックアップしたり、他の環境にコピーしたり、あるいは他のユーザーに配布したりすることができます。

実はとても便利な機能なのですが、このアプリテンプレートはCLIツールやAPIなどではダウンロードできません。しかたがないのでkintoneの管理画面から手動でダウンロードする必要があります。これは面倒くさい。

というわけで、GitHub Actionsを使って自動的にダウンロードするために「[macrat/download-kintone-template-action](https://github.com/macrat/download-kintone-template-action)」というアクションを作ってみました。
このアクションを使えば、わざわざブラウザを操作しなくとも、自動的にアプリテンプレートをダウンロードしてどこかに保存することができます。


# 注意

- 前述の通りCLIツールやAPIが提供されていないので、内部的には[Playwright](https://playwright.dev/)を使ってChromiumブラウザを起動してkintoneの管理画面を操作しています。安全性も安定性も保証しかねますので、自己責任でお使いください。
- まだ改善の余地がありそうなので、後方互換性のないアップデートをする可能性があるという意味でバージョン0.x系にしています。具体的には、起動が遅いのが気になっているので、もう少し高速に起動できる方法を考えたいと思っています。


# 最小限の使い方

まずは最小限のワークフローをご紹介します。

```yaml
# Actionsの画面から手動で起動する
on: [workflow_dispatch]

jobs:
  download:
    runs-on: ubuntu-latest
    steps:
      - name: Download kintone app template
        uses: macrat/download-kintone-template-action@v0
        with:
          base-url: ${{ secrets.KINTONE_BASE_URL }}  # kintone環境のURL (例: https://example.cybozu.com)
          app-id: ${{ secrets.KINTONE_APP_ID }}      # ダウンロードしたいアプリのID
          username: ${{ secrets.KINTONE_USERNAME }}  # kintoneのログインユーザー名
          password: ${{ secrets.KINTONE_PASSWORD }}  # kintoneのログインパスワード
          output: ./template.zip                     # ダウンロードしたzipファイルの保存先 (省略すると template.zip になる)

      # サンプルとして、アプリテンプレートはGitHub Actionsのアーティファクトとして保存する
      - name: Upload as artifact
        uses: actions/upload-artifact@v4
        with:
          name: kintone-app-template
          path: ./template.zip
```

このワークフローは、GitHub Actionsの画面から手動で起動することができます。
起動すると、指定したアプリのテンプレートがActionsの実行結果の画面にアーティファクトとして保存されます。


# もう少し実用的な使い方

実際には、アプリの更新と同時にアプリテンプレートをダウンロードしたいことが多いと思います。
その場合は、以前ご紹介した[kintoneカスタマイズを自動アップロードする方法](/blog/2025/08/upload-kintone-customize-from-github-actions)と組み合わせて、以下のようにすると良いでしょう。

```yaml
name: Deploy and Release kintone App

on:
  push:
    tags:
      - 'v*'  # vで始まるタグがpushされたら実行する

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write  # リリースを作成するために必要
    steps:
      - uses: actions/checkout@v5

      # カスタマイズファイルをアップロードする
      - name: Upload kintone customize file
        uses: macrat/upload-kintone-customize-action@v1
        with:
          base-url: ${{ secrets.KINTONE_BASE_URL }}
          app-id: ${{ secrets.KINTONE_APP_ID }}
          username: ${{ secrets.KINTONE_USERNAME }}
          password: ${{ secrets.KINTONE_PASSWORD }}
          desktop-js: ./src/desktop.js
          desktop-css: ./src/desktop.css

      # アプリテンプレートをダウンロードする
      - name: Download kintone app template
        uses: macrat/download-kintone-template-action@v0
        with:
          base-url: ${{ secrets.KINTONE_BASE_URL }}
          app-id: ${{ secrets.KINTONE_APP_ID }}
          username: ${{ secrets.KINTONE_USERNAME }}
          password: ${{ secrets.KINTONE_PASSWORD }}

      # リリースを作成してアプリテンプレートを添付する
      - name: Create Release
        run: gh release create $GITHUB_REF_NAME ./template.zip --title $GITHUB_REF_NAME --generate-notes
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
