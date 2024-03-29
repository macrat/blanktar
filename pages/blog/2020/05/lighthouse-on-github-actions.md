---
title: GitHub ActionsでLighthouseを実行する（treosh/lighthouse-ci-actions@v2使用）
pubtime: 2020-05-04T00:32:00+09:00
uptime: 2020-05-04T14:19:00+09:00
tags: [GitHub, CI/CD, テスト, Web]
description: GitHub Actionsを使ってプッシュの度にLighthouseを実行して、WebサイトのSEO対策の状況を自動的にテストしてもらう方法です。テスト結果はActionsのログから見れる他、Artifactとしても保存されます。
image: [/blog/2020/05/lighthouse-ci-result-on-github-actions.jpg]
---

[サイトのリニューアル](/blog/2020/05/blanktar-renewal)関連の記事の続きです。

新しいサイトはGitHubで管理しているので、GitHub Actionsを使った色々なテストをやっています。
そのうちの1つが、[Lighthouse](https://github.com/GoogleChrome/lighthouse)を使ったSEO対策やWebサイトの速度に関するテストです。

速度に影響すると思ってなかったところで影響が出てたりとか、そういうのが見えて結構面白いです。


# Workflowの定義

まずはforkflowの定義ファイルを作ります。
`.github/workflows/test.yml`的な名前のやつ。

手軽にテストを実行するために、今回は[treosh/lighthouse-ci-actions](https://github.com/treosh/lighthouse-ci-action)というものを使わせていただきます。
[lhciコマンド](https://github.com/GoogleChrome/lighthouse-ci/blob/master/docs/cli.md)を使うって手もあるみたいだけれど、面倒臭そうだったので。

``` yaml
name: Lighthouse CI

on: [push]

jobs:
  lighthouse-test:
    name: Lighthouse CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
      - run: npm ci
      - run: npm run build

      - uses: treosh/lighthouse-ci-actions@v2
        with:
          configPath: '.github/workflows/lighthouse.json'
          uploadArtifacts: true
```

`npm run build`して`npm start`するタイプのよくあるNode.jsのプロジェクトでの設定です。
このあたりを置き換えれば、Node.js以外のプロジェクトでも使えるはずです。


# lighthouserc.jsonの定義

次に、workflowで指定した設定ファイルの中身を作ります。
`.github/workflows/lighthouse.json`にしたやつ。

これはディレクトリの指定とか無いので、どこに置いても大丈夫です。
CI関連をまとめたかったのでworkflowsの中に置いてみたけれど、あんまりお行儀は良く無い気もする。

以下はこのサイトで使っている設定を少し簡略化したやつです。

``` json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm start",
      "url": [
        "http://localhost:3000/",
        "http://localhost:3000/blog"
      ]
    },
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "canonical": "off",
        "uses-http2": "off"
      }
    }
  }
}
```

`.ci.collect.url`にテストしたい対象のURLを、`.ci.assert`の中に適用したいルールを指定します。
ここでも`.ci.collect.startServerCommand`を書き換えてあげればNode.jsじゃないプロジェクトのテストも出来ます。

上記の例では最小限で、meta canonicalが正しいかのテスト（localhostなのでまずエラーになる）と、http2を使ってるかどうかのテスト（localhostなので常にエラーになる）を無効にしています。
サイトの特性に合せて設定してみてください。閾値とかも決められるようになっているみたいです。

使えるルールの一覧とか探したんですが見当たらなかったので、[プリセットの定義ファイル](https://github.com/GoogleChrome/lighthouse-ci/blob/master/packages/utils/src/presets/all.js)を見ながらなんとかしました。


# 試してみる

これで、あとはGitHubにpushすればLighthouseが自動で実行されるはずです。

実行結果は以下のような感じで、GitHubのActionsタブから見ることが出来ます。

![GitHubのActionsタブのスクリーンショット。Lighthouse Testが落ちていて、エラーメッセージが表示されている。lighthouse-resultsという名前でレポートファイルをダウンロード出来るようにもなっている。](/blog/2020/05/lighthouse-ci-result-on-github-actions.jpg "1280x922")

とても手軽でとても便利。

---

参考:
- [Webページを簡単な設定で評価してくれる Lighthouse CI を試してみた | Developers.IO](https://dev.classmethod.jp/articles/lighthouse-ci/)
