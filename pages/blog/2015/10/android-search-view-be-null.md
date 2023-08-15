---
title: androidでSearchView使おうと思ったらgetActionViewがnullを返してくる。releaseビルドのときだけ。
pubtime: 2015-10-03T13:44:00+09:00
amp: hybrid
tags: [Android, SearchView, MenuItemCompat, ProGuard]
description: AndroidのSearchViewをcompatライブラリで使おうとすると、releaseビルドのときだけMenuItemCompat.getActionViewがnullを返してくる問題の修正方法です。
---

[RuuMusic](https://play.google.com/store/apps/details?id=jp.blanktar.ruumusic)の検索を開始出来ないという致命的なバグを[修正](https://bitbucket.org/MacRat/ruumusic/commits/b6db79f6f58ed02f4496c14f3e5659e1eae4768c)しました。あとでAPKを公開します。
このバグなのですが、debugビルドだと再現せず、releaseビルドでだけ再現するというとてつもなく厄介なものでした。情報もあんまり無いので解決策を記録。

以下はRuuMusicのソースの抜粋です。
``` java
searchView = (SearchView)MenuItemCompat.getActionView(menu.findItem(R.id.menu_search));
if (searchView != null) {
    searchView.setOnQueryTextListener(playlist);
    searchView.setOnCloseListener(playlist);
}
```
とくに面白みのない普通のコードだと思います。nullチェックは消しても良い気がする。
で、`MenuItemCompat.getActionView`ってやつがnullを返してくるのです。releaseビルドのときだけで、debugビルドだと正しく動作します。

問題はどうやらソースコードでもxmlでもなくて、**ProGuard**っていうのが悪さしているようでした。
`proguard-rules.pro`ってファイルを開いて以下の一行を追記します。
```
.keep class android.support.v7.widget.SearchView { *; }
```
あとは普通にビルドすれば多分大丈夫。

ProGuardというのはandroid標準搭載な難読化ツールらしいです。余計なクラスだと思い込んで消しちゃった、ということみたい。

---

参考：
- [Android - NullPointerException on SearchView in Action Bar - Stack Overflow](http://stackoverflow.com/questions/18832890/android-nullpointerexception-on-searchview-in-action-bar)
- [AndroidでのProGuard 使い方 | android manifest configChanges](http://www.andr0o0id.com/?p=5340)
