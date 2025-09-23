---
title: GitHubにタグをpushするだけでリリースを作成できるようにする
description: GitHub Actionsを使って、GitHubにタグをpushするだけでリリースを自動作成する方法を紹介します。あえてリリースノートの自動生成などはせず、タグのアノテーションをそのまま使うシンプルな方法にしています。高頻度で小さなリリースを出すときに便利です。
pubtime: 2025-09-23T17:00:00+09:00
tags: [GitHub, CI/CD]
---

GitHub Actionsで自動的にリリースを作る仕組みを作ったので、やり方をご紹介します。
リリースを作成する方法はいろいろありますが、以下のようなシンプルな方法にしました。

- タグを作ってpushするとリリースが自動作成される。
- コンパイル結果などのアセットはGitHub Actions内でビルドする。
- リリースのタイトルと説明は、タグのアノテーションとして書く。

リリースノートは自動生成せずに、あえて手書きにしています。
自動生成は楽で良いのですが、生成されるノートは非エンジニアやGit慣れしていない人に分かりづらくなってしまうので、今回はこの方法にしました。

この方法を使えばgitコマンドだけでリリース作業が完結するので、小さなリポジトリで頻繁にリリースしたい場合に便利なはずです。


## ワークフローを作成する

`.github/workflows/release.yml` などの名前で、以下のようなワークフローを作成します。

```yaml
name: Release

on:
  push:
    # タグの形式は v1.2.3 のような形式を想定。ここを変えればどんな形式でも使えます。
    tags:
      - 'v*.*.*'

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v5

      # ポイント1: これをやらないとタグの情報を読めない。
      - name: Pull tags
        run: git fetch --tags --force

      # このあたりでビルドなどの作業をする。
      - uses: actions/setup-node@v5
        with:
          node-version: '24'
      - run: npm ci
      - run: npm run build
      # ビルド作業ここまで。

      # ポイント2: git tag -l でタグのアノテーションを読み取ることができる。
      - name: Extract release info
        id: metadata
        run: |
          echo "title=$(git tag -l --format '%(subject)' ${{github.ref_name}})" >> $GITHUB_OUTPUT
          echo "release_note<<EOF" >> $GITHUB_OUTPUT
          git tag -l --format '%(contents:body)' ${{github.ref_name}} >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      # ポイント3: リリースの作成はghコマンドでできる。
      # この例ではdistディレクトリ以下のファイルをすべてアセットとしてアップロードしている。
      - name: Create GitHub Release
        run: |
          gh release create ${{github.ref_name}} \
            --title "${{ steps.metadata.outputs.title }}" \
            --notes "${{ steps.metadata.outputs.release_note }}" \
            ./dist/*
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### ポイント1: タグをfetchする

[`actions/checkout`](https://github.com/actions/checkout)はタグをfetchしてくれません。 `fetch-tags` というオプションがあるのですが、うまくいかなかったので `git fetch --tags --force` を実行しています。
これをやっておかないと、 `git tag -l` を実行したときに `error: v0.1.0: cannot verify a non-tag object of type commit.` というようなエラーが出てしまいます。

タグの情報を読み取りたいときは、必ず `git fetch --tags` を実行しておきましょう。

### ポイント2: タグのアノテーションを読み取る

タグに付与したアノテーションは以下のコマンドで読み取ることができます。

- `git tag -l --format '%(subject)' <タグ名>`: アノテーションの1行目。
- `git tag -l --format '%(contents:body)' <タグ名>`: アノテーションの3行目以降。

formatの部分には他にもいろいろな指定ができます。詳しくは[git-for-each-ref](https://git-scm.com/docs/git-for-each-ref#_field_names)を参照してください。

ちなみにアノテーションとは、以下のように `-a` オプションを付けてタグを作成したときのコミットメッセージっぽい部分のことです。

```shell
$ git tag -a v1.2.3  # これをやるとエディタが開いてアノテーションを書ける。

$ git tag -a v1.2.3 -m "Release v1.2.3"  # -m オプションで指定することもできる。
```

### ポイント3: ghコマンドでリリースを作成する

リリースの作成には[GitHub CLI](https://docs.github.com/ja/github-cli/github-cli/about-github-cli)を使いました。GitHub Actionsには元々インストールされているのですぐに使えて便利です。

以下のようなコマンドでリリースを作成できます。

```shell
$ gh release create <タグ名> --title "<タイトル>" --notes "<説明>" <アセット1> <アセット2> ...
```

ここでいうアセットは、リリースページからダウンロードできるファイルのことです。
ビルドした実行ファイルなどの配布物を指定しましょう。

なお、ここでリリースの作成ができるように、[`jobs.<job_id>.permissions`](https://docs.github.com/ja/actions/reference/workflows-and-actions/workflow-syntax#jobsjob_idpermissions)で `contents: write` の権限を与えています。
デフォルトの設定によっては書かなくても動くかもしれませんが、明示的に指定しておくことで余計な権限を減らせるので、なるべく設定しておきましょう。

```yaml
jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write  # ← これ
```


## リリースを作成してみる

上記のワークフローを作成したら、あとは以下のコマンドだけでリリースを作成できます。

```shell
# タグを作る
$ git tag -a v1.2.3
(エディタが開くので、1行目にリリースのタイトル、3行目以降に説明文をMarkdown形式で書く)

# タグをpushする
$ git push origin v1.2.3
```

あとはGitHub Actionsがビルドとリリースの作成をやってくれます。
gitコマンドだけで完結してうれしいですね。

余談ですが、gpgでコミットに署名している場合は、 `-a` オプションの代わりに `-s` オプションにすると署名付きタグを作成できます。
GitHubで見たときに「Verified」マークが付いて正規のリリースであると確認できるようになるので安心です。


## リリースを作りなおす

リリースにミスがあったなどの場合で作りなおすときは、一度作成済みのリリースを削除してからもう一度タグをpushしなおしてください。
ユーザーには分かりづらいので、あまりやらない方が良いですが、やむを得ない場合は以下のように操作します。

```shell
# すでに作ったリリースを削除する（GitHubのWebページからやってもOK）
$ gh release delete v1.2.3

# force (-f) オプションを付けてタグを作りなおす
$ git tag -f -a v1.2.3

# force (-f) オプションを付けてpushしなおす
$ git push -f origin v1.2.3
```
