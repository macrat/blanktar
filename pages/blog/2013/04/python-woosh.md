---
title: pythonのwhooshで全文検索してみる
pubtime: 2013-04-03T23:11:00+09:00
amp: hybrid
tags: [Python, 全文検索, Whoosh]
description: Pythonの「woosh」というモジュールを使って日本語の全文検索を試してみました。若干構築が面倒ではありますが、かなり高速な検索が出来ます。
---

全文検索、一度やってみたかったのよね。
whooshってのが手っ取り早そう。

という訳で、使ってみました。
``` python
import os
import whoosh.fields
import whoosh.index
import whoosh.qparser

# ディレクトリをインデックスとして使うらしい。
#  インデックスがすでにあるかどうかをチェック。
if os.path.exists('/tmp/index')
    # 既存のインデックスを開く
    ix = whoosh.index.open_dir('/tmp/index')
else:
    # インデックスの構造を定義
    schema = whoosh.fields.Schema(
        # IDはユニーク・・・ってわけでもないらしい。
        #  とりあえず、インデックス化はされないとのこと。
        name=whoosh.fields.ID(stored=True),

        # n-gramで保存されるデータ。
        #  全文検索する時はとりあえずこれだけで良いんじゃないだろうか。
        body=whoosh.fields.NGRAM(stored=True)
    )

    # インデックスを作成
    #  ディレクトリがないとエラーになるみたいなので、mkdirで作っとく。
    os.mkdir('/tmp/index')
    ix = whoosh.index.create_in('/tmp/index', schema)

# インデックスを更新するためのものを作成
writer = ix.writer()

# データを追加してみる
#  unicode型限定なので注意。
writer.add_document(name=u'aa', body=u'hello whoosh')
writer.add_document(name=u'bb', body=u'whoosh test')
writer.add_document(name=u'cc', body=u'test string')

# 更新したら必ずコミットする
writer.commit()

# 取り敢えず検索
#  クエリを作成
parser = whoosh.qparser.QueryParser('body', ix.schema)
query = parser.parse(u'whoosh')

#  そしたら検索。
#   aa u'hello whoosh'
#   bb u'whoosh test'
#   みたいに表示されるはず。
results = ix.searcher().search(query)
for r in results:
    print r['name'], repr(r['body'])

# データを削除する
#  writerを作りなおさないといけないので。注意。
query = parser.parse(u'test')
writer = ix.writer()
writer.delete_by_query(query)
writer.commit()

# もっかい検索してみる
#  bbが削除されているので、aaのみが表示されるはず。
query = parser.parse(u'whoosh')
for r in ix.searcher().search(query):
    print r['name'], repr(r['body'])
```
だいたいこんなもんだろうか。
データの更新は、一旦削除してから追加し直すみたいね。

全体的に、ちょっとめんどい感じ。
もうちょいシンプルでいいから、なんか良いの無いかな・・・。

とはいえ、速度はすごい速いです。
インデックスの作成に時間が掛かる代わりに、検索が高速。

これで手頃に扱えると嬉しいんだけどねー・・・。ラッパーでも作ろうかしら。

---

参考：
- [Python純正の全文検索ライブラリ、Whooshを使ってみた - そこはかとなく書くよ](http://d.hatena.ne.jp/rudi/20110420/1303307332)
- [whooshで日本語検索 - takaki's web](http://takaki-web.media-as.org/blog/w6f01k)
