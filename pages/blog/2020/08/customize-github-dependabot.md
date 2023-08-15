---
title: GitHubのdependabotの挙動をカスタマイズする
pubtime: 2020-08-09T15:11:00+09:00
amp: hybrid
tags: [GitHub, CI/CD]
description: GitHubに組み込みの依存関係更新ツール（？）であるdependabotがPRを作るタイミングやラベルなどをカスタマイズする方法です。結構細かいところまで設定出来るっぽい。
faq:
  - question: GitHubのdependabotの設定ファイルの場所は？
    answer: .github/dependabot.yml にあります。
---

GitHubにセキュリティ機能として付いているdependabotを有効にしておくと、依存関係にセキュリティホールが見つかったときに更新のPRを上げてくれて便利です。
デフォルトでもそれっぽい挙動をしてくれるので楽なのですが、設定ファイルを用意すれば細かいカスタマイズが出来るみたいです。

dependabotで検索すると[native版のdependabot](https://dependabot.com/)ってやつのドキュメントが出てくるのですが、現在は[GitHub版](https://docs.github.com/en/github/administering-a-repository/keeping-your-dependencies-updated-automatically)の方が正です。


# 設定ファイルを用意する

`.github/dependabot.yml` に設定を書き込むことでdependabotの挙動をカスタマイズ出来るみたいです。
最小限必須な項目を書くと以下のような感じ。

``` yaml
version: 2

updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: daily
```

`package-ecosystem` は文字通り対象のパッケージマネージャです。
公式ドキュメントに[対応するパッケージマネージャのリスト](https://docs.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates#package-ecosystem)があります。

`schedule.interval` で `daily` や `weekly` 、 `monthly` などの実行間隔を指定出来ます。


# PRを送るブランチを指定する

初期状態ではデフォルトブランチに対してPRが送信されますが、 `target-branch` を指定すると対象ブランチを設定出来ます。
masterブランチの他にdevelopブランチが別にある場合とか、そんな用途で。

``` yaml
version: 2

updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: daily
    target-branch: develop
```


# アサイン/レビュアーを指定する

`assignees` と `reviewers` を設定することで、PRのアサインやレビュアーを指定することが出来ます。
レビュアーはチーム相手にも設定出来ます。

以下の例だと、`macrat`にアサインして、`some-org`って組織の`node-team`にレビューしてもらうようになっています。

``` yaml
version: 2

updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: daily
    assignees:
      - macrat
    reviewers:
      - some-org/node-team
```


# ラベルを指定する

`labels` を指定すると、PRに付くラベルを指定することが出来ます。
デフォルトだと `dependencies` が付きますが、これを変えたいときに使います。

以下は `node` と `依存関係` の2つのラベルを付ける例です。

``` yaml
version: 2

updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: daily
    labels:
      - node
      - 依存関係
```

---

参考: [Configuration options for dependency updates - GitHub Docs](https://docs.github.com/en/github/administering-a-repository/configuration-options-for-dependency-updates)
