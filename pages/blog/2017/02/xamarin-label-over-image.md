---
title: Xamarin.FormsでImageの上にLabelを重ねる
pubtime: 2017-02-06T01:05:00+09:00
tags: [Xamarin]
description: Xamarin.Formsで、Imageウィジェットの上にLabelを使って文字を重ねてみました。単純に重ねて表示する方法なので、ImageとLabel以外の組み合わせでも使えるはずです。
---

Xamarinです。Xamarin.Formsです。
画像があって、画像の上に文字を重ねる必要があったので、試してみました。
ここではImageとLabelの組み合せでやっていますが、多分他の物でも出来ると思います。

といっても方法はかなり単純で、Gridレイアウトに場所を指定せずに書くだけです。
XAMLで書くと以下のような感じ。
``` xml
<Grid>
    <Image x:Name="image" />
    <Label Text="Hello World" VerticalOptions="Center" HorizontalOptions="Center" />
</Grid>
```
これでimageの上にHello Worldという文字が重なります。簡単。

C#だけで書く場合は以下のようになります。
``` cs
Content = new Grid {
    Children = {
        new Image { Source = /* ここは適当に */ },
        new Label { Text = "Hello World", HorizontalOptions = LayoutOptions.Center, VerticalOptions = LayoutOptions.Center },
    },
};
```
やっぱり簡単。

ちなみに、重なりの順序は記述した順番になるようです。
つまり、後にあるものほど上に、始めにあるものほど奥に。
