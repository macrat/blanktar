---
title: Next.jsでWeb VitalsをGoogle Analyticsに記録する
pubtime: 2020-05-17T17:35:00+09:00
modtime: 2020-06-02T21:26:00+09:00
amp: hybrid
tags: [Next.js, Web Vitals, Google Analytics, Web]
description: Next.js 9.4から追加されたIntegrated Web Vitals Reportingという機能を使って、LCPやらFIDやらのWeb VitalsをGoogle Analyticsのカスタム速度に記録する方法です。Google Analyticsへの記録にはReact-GAを使っています。
image: [/blog/2020/05/nextjs-google-analytics-web-vitals.png]
---

Next.js 9.4から、[パフォーマンスモニタリング用の機能が追加](https://nextjs.org/blog/next-9-4#integrated-web-vitals-reporting)されました。
これを使うと、LCP（一番大きい要素が表示されるまでの時間）やFID（最初にインタラクティブになるまでの時間）などの情報を得ることが出来ます。便利。

このサイトでも、この機能で取得したデータを[Google Analytics](https://analytics.google.com/analytics/web/)の[カスタム速度](https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings?hl=ja)に記録するようにしてみました。
簡単にこれのやり方をメモしておきます。


# データを取得する

Web Vitalsのデータを取得するには、`pages/_app.jsx`に以下のようなコードを追加します。

``` javascript
export function reportWebVitals(metric) {
    console.log(metric);
}
```

これだけで、とりあえずコンソールにデータが表示されるようになります。


# Google Analyticsに送信する

Google Analyticsへの記録には、ここでは[React-GA](https://github.com/react-ga/react-ga)の[timing関数](https://github.com/react-ga/react-ga#reactgatimingargs)というものを使います。

最小限でとりあえず記録しようとすると、以下のような感じになります。

``` javascript
export function reportWebVitals({ name, value }) {
    ReactGA.timing({
        category: 'Web Vitals',
        variable: name,
        value: name === 'CLS' ? value * 1000 : value,
    });
}
```

~~CLSの時だけ単位が秒になるようなので、そこだけ1000倍してミリ秒に揃えています。~~

<PS date="2020-06-02" level={2}>

訂正。
CLSというのは画面がどのくらい変化したかも含めて計算される[Layout shift score](https://web.dev/cls/#layout-shift-score)というものの値のようで、単位は時間ではないみたいです。

では何故1000倍しているのかというと、Google Analyticsで扱うメトリクスは整数じゃないといけないのに対して、CLSは1以下の数字になったりするからだそうです。
という感じの説明が、[GitHubのWeb Vitalsのリポジトリ](https://github.com/GoogleChrome/web-vitals#using-analyticsjs)にありました。

時間じゃないのが時間として記録されてしまうので、ちょっと微妙かもしれませんね…。

</PS>

正常に機能すれば、Google Analyticsの[カスタム速度](https://analytics.google.com/analytics/web/#/report/content-site-speed-user-timings/)で記録を見ることが出来るはずです。
[カスタム速度は100%全部が記録されるわけではない](https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings?hl=ja#sampling_considerations)ので、そこだけ注意が必要です。
のんびり確認するくらいで居た方が良いかも。


# Typescriptの場合

9.4の時点では`reportWebVitals`の型が用意されていないみたいなので、自前で用意します。
おそらく以下のような感じで大丈夫そうです。

``` typescript
interface WebVitalsMetric {
    id: string;
    name: string;
    startTime: number;
    value: number;
    label: 'web-vital' | 'custom';
}

export function reportWebVitals({ name, value }: WebVitalsMetric): void {
    console.log(name, value);
}
```

---

参考:
- [Advanced Features: Measuring performance | Next.js](https://nextjs.org/docs/advanced-features/measuring-performance)
