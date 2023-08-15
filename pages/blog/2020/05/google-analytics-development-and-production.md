---
title: Google AnalyticsでVercel NowのDevelopmentとProductionを区別する
pubtime: 2020-05-10T19:41:00+09:00
amp: hybrid
tags: [Google Analytics, Web, Vercel Now]
description: このサイトはGitHubにプッシュするとVercel Nowにデプロイされるようになっています。なので、デバッグ用のデプロイとプロダクションデプロイの二種類があります。この記事は、そんな感じの2種類のサイトから得られるデータを区別する方法です。
image: [/blog/2020/05/google-analytics-view-list.jpg]
faq:
  - question: Google AnalyticsでDevelopmentデプロイとProductionデプロイを区別する方法は？
    answer: それぞれのビューを用意して、フィルタ機能を使ってドメイン名で区別するのが簡単です。
---

このサイトは、GitHubにプッシュすると自動的にVercel Nowにデプロイされるようになっています。
masterブランチはProductionとして、それ以外のブランチはDevelopmentとしてデプロイされるので、リリース前のチェックが手軽に出来て嬉しい。

ただこれ、1つ問題があって。
デプロイされるプログラム自身は自分がプロダクションか否かを知らないので、デバッグ用だろうが問答無用でGoogle Analyticsに記録をしてしまいます。

対処法としては、とりあえず記録は取らせてしまって、後から[ビュー](https://support.google.com/analytics/answer/2649553)という機能を使ってフィルタするのが良さそうです。


# やりかた

## 1. ビューを作る

[Google Analyticsの管理画面](https://analytics.google.com/analytics/web/)に行って、左下の<img alt="管理" style={{height: '1.5em', width: 'auto', transform: 'translateY(.5em)'}} width={141} height={40} src="/blog/2020/05/google-analytics-manage-button.png" />をクリックします。

開いた設定画面で、一番右の列の上にある<img alt="ビューを作成" style={{height: '1.5em', width: 'auto', transform: 'translateY(.5em)'}} width={216} height={44} src="/blog/2020/05/google-analytics-create-view-button.png" />をクリックすると新しいビューを作ることが出来ます。

![3つ列があるうちの、一番右の列がビューに関する設定です。この列の一番上に「ビューを作成」ボタンがあります。](/blog/2020/05/google-analytics-create-view-button-place.jpg "1200x403")

名前やタイムゾーンを聞かれるので、適当に答えます。
とりあえず、ProductionとDevelopmentで2つ作るのが良いと思います。


## 2. フィルタを設定する

ビューが出来たら、ドメイン名を使ってProduction（このサイトの場合は`blanktar.jp`）とDevelopment（こっちは`.now.sh`で終わるドメイン）を区別するようにします。

まず、設定画面から<img alt="フィルタ" style={{height: '1.5em', width: 'auto', transform: 'translateY(.5em)'}} width={180} height={43} src="/blog/2020/05/google-analytics-filter-button.png" />をクリックします。
出てきた画面の<img alt="フィルタを追加" style={{height: '1.5em', width: 'auto', transform: 'translateY(.5em)'}} width={260} height={61} src="/blog/2020/05/google-analytics-add-filter-button.png" />で新しいフィルタを作ります。

このサイトの場合、以下のような設定になっています。

![「プロダクションのみ」の場合、「右のみを含む」「ホスト名へのトラフィック」「等しい」で、ホスト名の欄が「blanktar.jp」になるようにしています。](/blog/2020/05/google-analytics-production-filter.jpg "389x320")
![「開発環境のみ」の場合、「右のみを含む」「ホスト名へのトラフィック」「最後が一致」で、ホスト名の欄が「.now.sh」になるようにしています。](/blog/2020/05/google-analytics-development-filter.jpg "417x320")


## 3. 確認する

これで、以下のようにビューを切り替えることでそれぞれのデプロイのデータを見ることが出来るようになりました。
普段はProductionの方を見ておいて、analytics関係のテストをしたいときはDevelopmentを見れば良い。とっても便利。

![ビュー切り替えのメニュー。「Development」「Production」「すべてのウェブサイトのデータ」の3つが表示されている。](/blog/2020/05/google-analytics-view-list.jpg "900x600")
