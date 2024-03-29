---
title: Reactでステートの値が反映されない時に試すこととその理由
pubtime: 2020-06-03T20:48:00+09:00
tags: [React, JavaScript, Web]
description: ReactのコールバックやuseEffectで、更新したはずのステートの値をちゃんと取得出来ないことがあります。これを回避する方法と、そもそも何故そんなことになるのかという解説です。
image: [/blog/2020/06/react-why-state-not-updated.png]
---

ReactでコールバックとかuseEffectをごちゃごちゃ書いていると、時々ステートの値が上手く更新されていなくて困ることがあります。

たとえば、以下のようなコードを書いているときとか。

``` jsx
export default () => {
    const [count, setCount] = useState(0);

    const onClick = () => {
        setCount(count + 1);  // カウントを1増やした
        console.log(count);  // 1増えた値が表示されてほしい（でも増える前の値が出る）
    };

    return (
        <button onClick={onClick}>{count}</button>
    );
};
```

useEffectの場合も同じような感じで、セットした直後に取得しようとしても値は更新されていません。

``` javascript
const [double, setDouble] = useState(0);

useEffect(() => {
    setDouble(count * 2);  // countが更新されたら、doubleには常に2倍の値を入れる。
    console.log(double);  // 上の行で計算した数字を表示したい（でも実際は更新する前の値が出る）
}, [count]);
```

ポイントは、「値をセットした処理と同じ流れで値を取得しようとしている」というところにあります。（もっと厳密な解説は[下の方](#そもそも何故こんなことになるのか)に書いてあります）


# 対処方法

以下のようにして[useEffect](https://ja.reactjs.org/docs/hooks-reference.html#useeffect)を使ってやると「値をセットした処理」とは別になるので、更新後の値を取得出来るようになります。
（あんまり厳密な表現じゃないけど、イメージとして）

``` jsx
// ボタンがクリックされたら呼ばれる部分
const onClick = () => {
    setCount(count + 1);  // カウントを1増やした
};

// countが更新されたら呼ばれる部分
useEffect(() => {
    console.log(count);  // これなら1増えた値が表示される
}, [count]);
```

useEffectを使った例の場合は、以下のようにuseEffectをチェーンしてあげれば取得出来ます。

``` jsx
// countが更新されたら呼ばれる部分
useEffect(() => {
    setDouble(count * 2);
}, [count]);

// countが更新されたら呼ばれる部分
useEffect(() => {
    console.log(double);  // これならちゃんと最新のcount*2の値が表示される
}, [double]);
```


# そもそも何故こんなことになるのか

ReactのuseStateでステートを使っているとついついクラスのメンバを触っているような感覚になるのですが、実際は結構不思議な動きをしています。
わりと複雑なので、順を追って解剖してみましょう。


## functional componentはめっちゃ呼ばれまくる

試しに以下のコンポーネントを実行してみてください。

``` jsx
export default () => {
    console.log('関数が呼ばれた');

    const [count, setCount] = useState(0);

    const onClick = () => {
        console.log('クリックされた');
        setCount(count + 1);
    };

    return (
      <button onClick={onClick}>{count}</button>
    );
}
```

クリックを数えるだけのボタンです。

これを実行してみると、クリックする度に「クリックされた」だけでなく「関数が呼ばれた」も表示されることがお分かり頂けるかと思います。

クリック時の「関数が呼ばれた」ですが、`setCount(count + 1)`の行をコメントアウトすると表示されなくなります。

この挙動は、**ステートが1つでも更新されると関数全体がもう一回呼び出される**というルールによるものです。


## useStateするまで値は変わらない

さきほどの関数の`console.log`を増やして、以下のようにしてみました。

``` jsx
export default () => {
    console.log('関数が呼ばれた');

    const [count, setCount] = useState(0);
    console.log(`useStateを呼んだ（count=${count}）`);

    const onClick = () => {
        console.log(`クリックされた（count=${count}）`);
        setCount(count + 1);
        console.log(`値をセットした（count=${count}）`);
    };

    return (
      <button onClick={onClick}>{count}</button>
    );
}
```

これで実行すると、大体以下のような挙動になります。
（若干見やすくしてます）

```
関数が呼ばれた
useStateを呼んだ（count=0）

クリックされた（count=0）
値をセットした（count=0）

関数が呼ばれた
useStateを呼んだ（count=1）
```

この結果から、`count`の値が更新されるのはステートの更新によって関数が呼び出された後ということが分かります。
厳密に言うと、ステートをセットしたあと`useState`をもう一度呼ぶまでは`count`の値は変わらない、ということになります。


## useEffectが呼ばれるタイミングは結構遅い

では、[対処方法](#対処方法)として使ったuseEffectが呼ばれるタイミングを調べてみましょう。

``` jsx
export default () => {
    console.log(`関数が呼ばれた`);

    const [count, setCount] = useState(0);
    console.log(`useStateを呼んだ（count=${count}）`);

    const onClick = () => {
        console.log(`クリックされた（count=${count}）`);
        setCount(count + 1);
        console.log(`値をセットした（count=${count}）`);
    };

    useEffect(() => {
        console.log(`useEffectが呼ばれた（count=${count}）`);
    }, [count]);

    return (
      <button onClick={onClick}>{count}</button>
    );
};
```

だいぶ長くなってまいりましたが、増えたのはuseEffectの部分だけです。

実行すると、以下のようなログが出ます。

```
関数が呼ばれた
useStateを呼んだ（count=0）
useEffectが呼ばれた（count=0）

クリックされた（count=0）
値をセットした（count=0）

関数が呼ばれた
useStateを呼んだ（count=1）

useEffectが呼ばれた（count=1）
```

直感的なイメージよりもだいぶ遅いタイミングで呼ばれています。
[useEffectに渡した関数が呼ばれるタイミング](https://ja.reactjs.org/docs/hooks-reference.html#timing-of-effects)は、常にコンポーネントが(再)レンダリングされた後（つまりコンポーネントが実行されなおした後）になるようです。

このタイミングのおかげで、useStateを呼び直してからuseEffectの中身が呼ばれることになります。
結果として、useEffectの中であればセットされた新しいステートを取得出来るということになります。


## useEffectをチェーンするとfunctional componentはさらにめっちゃ呼ばれまくる

あとはご想像付くと思いますが、[対処方法](#対処方法)で使ったuseEffectを繋げていく書き方の場合の挙動も見てみましょう。

``` jsx
export default () => {
    console.log(`関数が呼ばれた`);

    const [count, setCount] = useState(0);
    const [double, setDouble] = useState(0);
    console.log(`useStateを呼んだ（count=${count}, double=${double}）`);

    const onClick = () => {
        console.log(`クリックされた（count=${count}, double=${double}）`);
        setCount(count + 1);
        console.log(`値をセットした（count=${count}, double=${double}）`);
    };

    useEffect(() => {
        console.log(`useEffect(count)が呼ばれた（count=${count}, double=${double}）`);
        setDouble(count * 2);
    }, [count]);

    useEffect(() => {
        console.log(`useEffect(double)が呼ばれた（count=${count}, double=${double}）`);
    }, [double]);

    return (
      <button onClick={onClick}>{count}</button>
    );
};
```

ログは以下のようになりました。

```
関数が呼ばれた
useStateを呼んだ（count=0, double=0）
useEffect(count)が呼ばれた（count=0, double=0）
useEffect(double)が呼ばれた（count=0, double=0）

クリックされた（count=0, double=0）
値をセットした（count=0, double=0）

関数が呼ばれた
useStateを呼んだ（count=1, double=0）
useEffect(count)が呼ばれた（count=1, double=0）

関数が呼ばれた
useStateを呼んだ（count=1, double=2）
useEffect(double)が呼ばれた（count=1, double=2）
```

この流れを文章で書いてみると、以下のような感じでしょうか。

1. `setCount`が呼ばれたことによってステートが更新されて
2. ステートが更新されたので関数コンポーネントがもう一回実行されて
3. 関数コンポーネントを実行してみたら`count`が更新されていることを検知して
4. `count`が更新されてたのでuseEffect(count)が実行されて
5. useEffect(count)の中で`setDouble`が呼ばれたことによってステートが更新されて
6. ステートが更新されたので関数コンポーネントがもう一回実行されて
7. 関数コンポーネントを実行してみたら今度は`double`が更新されていることを検知した
8. `double`が更新されてたのでuseEffect(double)が実行される

うーん、長い。


## まとめ

基本的には、以下2点を抑えておけば良いのではないかと思います。

1. 関数コンポーネントのステートはすぐ更新されるわけではない（次に関数コンポーネントが実行されなおすまでは更新されない）
2. useEffectが実行されるのは、次に関数コンポーネントが実行されたタイミングまで遅延する（ここまで待てばステートも更新されてる）

Reactはこの手の面白挙動が結構あるのでやってて楽しい気がしています。詰むとてもつらいけれど。
