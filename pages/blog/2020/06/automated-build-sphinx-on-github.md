---
title: Sphinxで書いたドキュメントをGitHub ActionsでPDFやHTMLに自動ビルド
pubtime: 2020-06-19T19:45:00+09:00
tags: [GitHub, CI/CD, Sphinx]
image:
  - /blog/2020/06/github-actions-automated-release_1200x1200.jpg
  - /blog/2020/06/github-actions-automated-release_1200x600.jpg
description: GitHub上で管理しているSphinxのドキュメントを、タグを打つだけでGitHub Actionsがビルドしてリリースに保存するようにしてみました。ビルドの手間もファイル共有の手間も無くなるので、かなり便利です。
---

仕事上のマニュアルを[Sphinx](https://www.sphinx-doc.org/)でまとめたリポジトリがGitHub上にあります。
ちょこちょこアップデートが入るのですが、都度手元でビルドして共有ファイルサーバに上げるのも面倒臭いし、かといって「見たいときにビルドしてね」だと不親切すぎる。

というわけで、タグを打ったら[GitHub Actions](https://github.co.jp/features/actions)が勝手にビルドしてくれるようにしてみました。


# 実行結果のイメージ

ビルド結果のHTMLとPDFは、以下のような感じでリリースページに保存されるようになっています。

![GitHubのリリースページに「v2.0.0」という名前のリリースが「github-actions」というユーザによって作られている。Assetsには「manual\_HTML.zip」と「manual\_PDF.pdf」の2つが保存されている。](/blog/2020/06/github-actions-automated-release_1200x600.jpg "800x400")

リリース本文（モザイクが掛かっている部分）には、タグに付けたコメントが表示されています。
どこを更新しましたとか、そんな感じの内容を入れておくとノンエンジニアにも変更内容が分かりやすくて便利。


# 設定ファイル

完成したworkflowは以下のような感じ。
これを、`.github/workflows/release-build.yml`とかに置いておくと実行されます。

こうしてみると単純ですが、デバッグに結構苦戦しました…。

``` yaml
name: release build

# vから始まるタグが付いたら実行する（例: v1, v1.2, v1.2.3）
on:
  push:
    tags: ['v*']

jobs:
  release:
    name: release build
    runs-on: ubuntu-latest
    steps:
      # 準備
      - name: checkout
        uses: actions/checkout@v2
      - name: pull builder image
        run: docker pull macrat/sphinx-pdf

      # ビルドする
      - name: build
        run: docker run --rm --user $UID -v `pwd`:/docs macrat/sphinx-pdf

      # HTMLはzipにまとめる
      - name: create zip
        run: |
          mv ./_build/html ./manual
          zip -r HTML.zip ./manual

      # GitHubにリリースを作る
      - name: create release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: ${{ github.ref }}
          draft: false
          prerelease: false

      # PDFファイルをリリースページにアップロード
      - name: upload PDF
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./_build/latex/sphinx.pdf
          asset_name: manual_PDF.pdf
          asset_content_type: application/pdf

      # HTMLを固めたzipをリリースページにアップロード
      - name: upload HTML
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./HTML.zip
          asset_name: manual_HTML.zip
          asset_content_type: application/zip
```

GitHub Actions上でSphinxとかlatexとかをインストールするのが面倒だったので、自作した[SphinxをHTMLとPDFにビルドするDockerイメージ](https://hub.docker.com/r/macrat/sphinx-pdf)を使用するようにしています。

リリースの作成には公式で用意されている[actions/create-release](https://github.com/actions/create-release)を、ビルド結果のアップロードには同じく公式の[actions/upload-release-asset](https://github.com/actions/upload-release-asset)を使用しています。
