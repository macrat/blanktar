---
title: dmenuに学習っぽいことをしてもらう
pubtime: 2013-01-24T02:51:00+09:00
tags: [Linux, 環境構築]
description: Linux向けのキーボードランチャーである「dmenu」で、最近起動したコマンドを優先的に表示してもらうようにする方法です。
---

dmenu。ご存知ですか、dmenu。
元々はdwmというウィンドウマネージャー用のキーボードランチャーです。
コレがね、便利なんだわ。めっちゃ便利なんだわ。
私なんかは便利さのあまりfluxboxでも使ってるほど。

んでも、んでもね？
PATHに設定されているディレクトリにあるコマンドを候補にするんですが・・・何度同じの打っても学習とかしてくれないんすよ。
chromiumを起動したいのにchroまでchrootが表示されるというこの悲しさね。
いっそchあたりでもうchromiumって補完して欲しいじゃないか！　なあ！

・・・まあ、長すぎる前置きはともかくとして。

dmenuってのは`dmenu`ってコマンドと`dmenu_run`ってシェルスクリプトの組み合わせで構成されておりまして。

dmenu\_runというスクリプトが候補一覧を作成（or キャッシュから読み出し）して、dmenuコマンドに渡す。

候補一覧を渡されたdmenuはその中から選ばせて、そいつを標準出力で返す。

帰ってきたのをdmenu\_runが起動する、という仕組みになっております。

この時のキャッシュ（普通にコマンドのリストが書いてあるだけ）を利用して、学習っぽいことをしてもらおう、というお話。

お話っていうか、普通に書いたスクリプトを公開するだけだけどね。
``` bash
#!/bin/sh
cachedir=${XDG_CACHE_HOME:-"$HOME/.cache"}
if [ -d "$cachedir" ]; then
	cache=$cachedir/dmenu_run
else
	cache=$HOME/.dmenu_cache # if no xdg dir, fall back to dotfile in ~
fi

IFS=:
if stest -dqr -n "$cache" $PATH; then
	lst=`stest -flx $PATH | sort -r | tee "$cache"`
else
	lst=`cat "$cache"`
fi

choice=`printf "$lst\n" | tac | dmenu "$@"`
if [ "$choice" != "" ];then
	lst=`printf "$lst" | grep -v "^$choice\$"`
	printf "$lst\n" > "$cache"
	echo $choice | tee -a "$cache" | tac | ${SHELL:-"/bin/sh"} &
fi
```
とりあえずこんな感じ。

こいつをコピー（もしくは[これ](/blog/2013/01/dmenu_run.sh)をダウンロード）して、`/usr/bin/dmenu_run`に上書きしてください。（環境によっては違う場所かも）
勿論バックアップを忘れずに。

ほんでdmenuを使ってみると、学習するようになってる、はず。

表示の優先順位を上げてるだけなので、例えばlsusbって打っちゃうと、次にlsを使いたい時はlsって打ってから→キーで選ばないといけなくなります。
そのへんはまあ、どっちを取るかって事で。

オリジナルより処理が増えてるし、grepとか使っちゃったし、コマンドがめっちゃ多い環境とかでは起動が重くなっちゃうかもねー。
まあ、試してみてくださいな。くれぐれもバックアップはしておくように。
