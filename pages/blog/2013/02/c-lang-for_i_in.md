---
title: C言語でfor i inをしたい
pubtime: 2013-02-15T21:10:00+09:00
amp: hybrid
tags: [C言語, マクロ, tcc, ネタ, メタプログラミング]
description: C言語のマクロを使って、Pythonなどのスクリプト言語にありがちな`for i in range(10)`のようなものを作ってみました。可読性がやばいので、ネタ記事と思ってください。
---

メモです、小ネタです、てゆかネタです。

危険ですのであんまり真似しないでください。何が危険って、可読性がやばいです、読めないです。

``` c
#include <stdio.h>

#define PUT(var)	printf("%s = %d\n", #var, var)

#define RANGE(var, start, end) \
int(##var) = start; var != end; var += (start < end ? 1 : -1)

int main()
{
	for(RANGE(a, 0, 10))
		PUT(a);

	for(RANGE(b, 0, -10))
		PUT(b);

	int end = 10;
	for(RANGE(c, 0, end))
	{
		PUT(c);
		if(c > 5)
			end = 0;
	}

	return 0;
}
```
上二つは普通にカウントアップとカウントダウン。

最後のは0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0ってなるちょっとアクロバティックな動作。

いやー、キモい。
C言語なのか何なのかよく分からない。
マクロ良くないね。いや、適度な使用は良いんだろうけれど。うかつに使うと可読性が酷いことに。

---

なお、上記ソースはtccのversion 0.9.25で動作確認しました。gccでやったらめっちゃ怒られました。
