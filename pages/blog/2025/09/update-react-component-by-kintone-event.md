---
title: kintoneでReactを使っていたら`You are calling ReactDOMClient.createRoot() ...`というエラーが出た
description: Reactを使ってkintoneをカスタマイズするときは、特定の画面が表示されたというイベントをトリガーにしてコンポーネントをマウントすることになります。しかし、一覧画面などのイベントはページ送りの操作で何度も発生するため、コンソールに警告が出てしまったり、リソースがうまく開放されなかったりする問題が発生します。この記事では、その問題の概要を解決方法をご紹介します。
pubtime: 2025-09-16T18:34:00+09:00
tags: [kintone, React, JavaScript]
---

kintoneを高度にカスタマイズしたいときはReactを使うと便利です。
Cybozu Developer Networkにも[Reactを使う方法の解説](https://cybozu.dev/ja/kintone/tips/development/customize/development-know-how/javascript-customize-middle-class-react/)が掲載されているので簡単に初められる……はずなのですが、残念ながらこの記事の方法そのままだとうまくいかない場面があります。


# 問題の概要

その問題は、たとえば以下のようなコードで発生します。

```typescript
import React from 'react';
import { createRoot } from 'react-dom/client';

// レコードのタイトルを箇条書きで表示するコンポーネント。
const ShowList = ({ records }: { records: kintone.types.SavedFields[] }) => {
  return (
    <ul>
      {records.map((r) => (
        <li key={r.$id.value}>{r.タイトル.value}</li>
      ))}
    </ul>
  );
};

// 一覧画面が表示されたらShowListコンポーネントをマウントする。
kintone.events.on('app.record.index.show', (event) => {
  const root = createRoot(kintone.app.getHeaderSpaceElement()!);

  root.render(<ShowList records={event.records} />);

  return event;
});
```

このコードを動かすと、一覧画面にレコードのタイトルが箇条書きで表示されるはずです。
この時点では問題ありません。

しかし、ページャーを使って次のページ/前のページを表示しようと、以下のようなことが起きてしまいます。

1. DOMの状態やJavaScriptのコンテキストはそのままで、`app.record.index.show`イベントがもう一度発生する。
2. `createRoot`で新しいReactルートを作ろうとする。
3. すでに同じ場所にルートがあるので、以下のようなエラーが出る。  
   `download.do?... You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it.`
4. エラーを無視してそのまま`root.render`が呼ばれて、一応は表示が更新される。

同じHTML要素に対して`createRoot()`を複数回呼んでしまったせいで、エラーが発生してしまいました。


# 解決方法

この問題を解決するには、`createRoot`で作成したルートをどこかに保存しておいて、2回目以降はそれを使い回すようにします。
一番単純な方法は、以下のようにモジュールスコープの変数に保存しておくやり方です。

```typescript
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';

// レコードのタイトルを箇条書きで表示するコンポーネント。
const ShowList = ({ records }: { records: kintone.types.SavedFields[] }) => {
  // ここはさっきと一緒。
};

// 一度作ったルートはここに保存するようにする。
let root: Root | null = null;

// 一覧画面が表示されたらShowListコンポーネントをマウントする。
kintone.events.on('app.record.index.show', (event) => {
  // まだルートが無いときだけcreateRootを呼ぶ。
  // 2回目移行は、既存のルートに対してrenderを呼ぶだけ。
  if (!root) {
    root = createRoot(kintone.app.getHeaderSpaceElement()!);
  }

  root.render(<ShowList records={event.records} />);

  return event;
});
```

複数のイベントで別々のコンポーネントをマウントする場合などは、すでにマウントしたルートの`unmount()`を呼ぶ仕組みなどが必要になるかもしれません。
ただ、2025年現在で試した限りでは、同じコンテキスト内で別のイベントが発生することはあまり無いようです。
なので、上記のようなシンプルな対応で十分そうです。

また、別案として`root.render()`を呼ぶ代わりに`useState`や`createContext`を使う方法も試してみましたが、挙動は変わらないようでした。render関数がうまく効率的に処理してくれるようです。
効率の観点でも問題がなさそうなので、やはり上記の方法が良さそうです。


# 発展形: コンテキストを使ってpropsのリレーを省略する

ここからはやや余談です。

kintoneから渡されるイベントが必要な箇所は、必ずしもコンポーネントの直下とは限りません。
実際のユースケースではコンポーネントが入れ子になっていることが多いでしょう。
そうなると、必要なコンポーネントまでイベントの値をリレーしていくことになりますが、これはかなり面倒です。

そこで、[ReactのContextという機能](https://ja.react.dev/learn/passing-data-deeply-with-context)を使うパターンをご紹介します。
上記のやり方と組み合わせると、kintoneのイベントが発生したタイミングで更新が必要なコンポーネントだけをピンポイントで更新してくれるので、処理の効率も良くなります。

## Before: 面倒くさいpropsのリレー

普通にpropsだけで作っていくと、以下のようになります。

この書き方でも問題はないのですが、`App`コンポーネントは子コンポーネントである`ShowList`に渡すためだけに`records`というpropsを受け取っている点があまり綺麗ではありません。
入れ子が一段、使う箇所が一箇所くらいであれば大した問題にはなりませんが、深くネストしていたり、多数のコンポーネントで使っていたりすると大変なことになってしまいます。

```typescript
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';

// レコードのタイトルを箇条書きで表示するコンポーネント。
const ShowList = ({ records }: { records: kintone.types.SavedFields[] }) => {
  return (
    <ul>
      {records.map((r) => (
        <li key={r.$id.value}>{r.タイトル.value}</li>
      ))}
    </ul>
  );
};

// 見出しとShowListコンポーネントをまとめて表示するコンポーネント。
// 
// 本当はrecordsに興味はないのだけれど、ShowListに渡すために受け取らざるをえない。面倒くさい！
const App = ({ records }: { records: kintone.types.SavedFields[] }) => {
  return (
    <div>
      <h2>レコード一覧</h2>
      <ShowList records={records} />
    </div>
  );
};

let root: Root | null = null;

kintone.events.on('app.record.index.show', (event) => {
  if (!root) {
    root = createRoot(kintone.app.getHeaderSpaceElement()!);
  }

  root.render(<App records={event.records} />);

  return event;
});
```

## After: コンテキストを使うと簡単

propsのバケツリレーを避けるためには、ReactのContextという機能が使えます。
これを使えば、イベントで受け取った値をコンテキストに保存しておき、子コンポーネントや孫コンポーネントなどの必要な場所から取り出して使うことができます。

```typescript
import React, { createContext, useContext } from 'react';
import { createRoot, type Root } from 'react-dom/client';

// イベントから渡される値を保存するためのコンテキスト。
const RecordsContext = createContext<kintone.types.SavedFields[]>([]);

// イベントから渡された値を取り出すためのカスタムフック。
const useRecords = () => useContext(RecordsContext);

// レコードのタイトルを箇条書きで表示するコンポーネント。
const ShowList = () => {
  const records = useRecords();  // コンテキストからレコードを取得する。

  return (
    <ul>
      {records.map((r) => (
        <li key={r.$id.value}>{r.タイトル.value}</li>
      ))}
    </ul>
  );
};

// 見出しとShowListコンポーネントをまとめて表示するコンポーネント。
//
// 興味のないrecordsのことを考慮しなくて良くなった！
const App = () => {
  return (
    <div>
      <h2>レコード一覧</h2>
      <ShowList />
    </div>
  );
};

let root: Root | null = null;

kintone.events.on('app.record.index.show', (event) => {
  if (!root) {
    root = createRoot(kintone.app.getHeaderSpaceElement()!);
  }

  // AppをRecordsContextでラップすることで、Appの中のすべてのコンポーネントでuseRecordsが使えるようになる。
  root.render(
    <RecordsContext value={event.records}>
      <App />
    </RecordsContext>
  );

  return event;
});
```

ちなみに、React 19からは`<RecordsContext.Provider>`ではなく`<RecordsContext>`と書けるようになりました。
上記の例では新しい書き方を使っています。


# まとめ

kintoneのイベントは複数回発生することがあるので、イベントハンドラ内で`createRoot()`を呼ぶときは、この記事でご紹介したような注意が必要です。  
また、ReactのContext機能を使うことで、イベントで受け取った値を綺麗に扱えるようになります。

kintoneのカスタマイズでReactを使うときの参考になれば幸いです。
