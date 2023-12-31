---
title: OpenSSLのBIGNUM関連の関数群に関するメモ
pubtime: 2014-10-06T00:50:00+09:00
tags: [C言語, OpenSSL, セキュリティ]
description: C言語/OpenSSLのBIGNUM関連の日本語ドキュメントが極端に少なかったので、必要そうなところだけ和訳したものです。
---

C言語で暗号を扱ってみようと思ってOpenSSLのBIGNUMを使い始めたのだけれど、あまりにも日本語のドキュメントが無い。
とりあえず[リファレンス](https://www.openssl.org/docs/crypto/bn.html)あたりを読んで理解したことをメモっておく。
めぼしい所だけ書いているので、完全ではありません。

ちなみに筆者であるMacRatは英語出来ません。間違い多いと思うので見つけたらご連絡ください。修正します。

# 初期化と破棄
`BUGNUM *BN_new(void)`は**BIGNUM**構造体を動的に確保して返却します。確保に失敗すると**NULL**が返ります。
`void BN_init(BIGNUM *a)`はまだ初期化されていない**BIGNUM**構造体を初期化します。静的に確保されたものに使う用。

`void BN_clear(BIGNUM *a)`は不要になった暗号鍵などの機密データを破棄するために使います。メモリを0で埋めて消去します。

`void BN_free(BIGNUM *a)`は**BIGNUM**構造体を開放します。`BN_new()`だけでなく`BN_init()`で作られたものも開放する必要があるらしい？
`void BN_clear_free(BIGNUM *a)`を使うと`BN_clear()`を呼んでから`BN_free()`を呼んでくれるっぽい。

# データのコピー
`BIGNUM *BN_copy(BIGNUM *to, const BIGNUM *from)`で**from**から**to**へ値をコピーできます。

`BIGNUM *BN_dup(const BIGNUM *from)`は**from**と同じ値を持つ新しい**BIGNUM**を作って返却します。

どちらの関数も成功するとコピー先の**BIGNUM**へのアドレスを返し、失敗すると**NULL**を返します。

# データの置き換え
`void BN_swap(BIGNUM *a, BIGNUM *b)`を使うと**a**と**b**の値を入れ替えることができます。

# バイナリとの変換
`char* BN_bn2bin(const BIGNUM *a, unsigned char*to)`、`BIGNUM *BN_bin2bn(const unsigned char *s, int len, BIGNUM *ret)`を使ってバイナリとBIGNUMを変換することができます。
`BN_bin2hex`、`BN_hex2bin`を使うと16進数の文字列にも変換できるようです。

# 値のセット
`int BN_zero(BIGNUM *a)`、`int BN_one(BIGNUM *a)`を使うと、それぞれ0か1を**BIGNUM**にセットします。
成功すると1が、失敗すると0が返却されます。

`const BIGNUM *BN_value_one(void)`は必ず1が入った**BIGNUM**構造体を返却します。

`int BN_set_word(BIGNUM *a, unsigned long w)`を使うと、aにwの値を代入することが出来ます。
これも成功すると1が、失敗すると0が返却されます。

`unsigned long BN_get_word(BIGNUM *a)`を使うとaの値をlong型で得ることが出来ます。
エラー時は0xffffffffLが返却されます。・・・多分。

# 乱数
`int BN_rand(BIGNUM *rnd, int bits, int top, int bottom)`<br />
`int BN_pseudo_rand(BIGNUM *rnd, int bits, int top, int bottom)`<br />
はビット長がbitsな乱数を生成してrndに格納します。

topに-1を渡すと最上位ビットが0になることがあるようです。0にすると最上位ビットは必ず1に、1を渡すと・・・英語力が足りないので分かりません。
bottomに0以外の値を渡すと必ず奇数が生成されます。

`int BN_rand_range(BIGNUM *rnd, const BIGNUM *range)`<br />
`int BN_pseudo_rand_range(BIGNUM *rnd, const BIGNUM *range)`<br />
は0からrangeで与えられた値までの範囲で乱数を生成します。

二つずつある関数はほぼ同じ動きをしますが、pseudoが付いている方は暗号的な強度が低いようです。予測可能ということらしい。
どの関数も成功すると1を、失敗すると0を返却します。

# CTX
**BN_CTX**構造体は**BIGNUM**の計算を行うための一時的な変数を保持するための構造体です。いちいち動的に確保していると時間がかかるので構造体として外に出しているようです。

`BN_CTX *BN_CTX_new(void)`を呼び出すことで**BN_CTX**構造体を動的に確保します。確保に失敗すると**NULL**を返却します。
`void BN_CTX_init(BN_CTX *c)`を使ってまだ初期化されていない**BN_CTX**構造体を初期化することも出来ます。

`void BN_CTX_free(BN_CTX *c)`を使って**BN_CTX**構造体を開放します。

# 計算
`int BN_add(BIGNUM *r, const BIGNUM *a, const BIGNUM *b)`<br />
a + b = r

`int BN_sub(BIGNUM *r, const BIGNUM *a, const BIGNUM *b)`<br />
a - b = r

`int BN_mul(BIGNUM *r, const BIGNUM *a, const BIGNUM *b, BN_CTX *ctx)`<br />
a * b = r

`int BN_sqr(BIGNUM *r, const BIGNUM *a, BN_CTX *ctx)`<br />
a^2 = r

`int BN_div(BIGNUM *dv, BIGNUM *rem, const BIGNUM *a, const BIGNUM *d, BN_CTX *ctx)`<br />
a / d = dv 余り rem

`int BN_mod(BIGNUM *rem, const BIGNUM *a, const BIGNUM *m, BN_CTX *ctx)`<br />
a%%m = rem （答えがマイナスになることがある

`int BN_nmod(BIGNUM *rem, const BIGNUM *a, const BIGNUM *m, BN_CTX *ctx)`<br />
a%%m = rem （答えがマイナスにならない

`int BN_exp(BIGNUM *r, const BIGNUM *a, const BIGNUM *p, BN_CTX *ctx)`<br />
a^p = r

`int BN_mod_add(BIGNUM *r, const BIGNUM *a, const BIGNUM *b, const BIGNUM *m, BN_CTX *ctx)`<br />
(a+b)%%m = r

`int BN_mod_sub(BIGNUM *r, const BIGNUM *a, const BIGNUM *b, const BIGNUM *m, BN_CTX *ctx)`<br />
(a-b)%%m = r

`int BN_mod_mul(BIGNUM *r, const BIGNUM *a, const BIGNUM *b, const BIGNUM *m, BN_CTX *ctx)`<br />
(a*b)%%m = r

`int BN_mod_sqr(BIGNUM *r, const BIGNUM *a, const BIGNUM *m, BN_CTX *ctx)`<br />
(a^2)%%m = r

`int BN_mod_exp(BIGNUM *r, const BIGNUM *a, const BIGNUM *p, const BIGNUM *m, BN_CTX *ctx)`<br />
(a^p)%%m = r

`int BN_exp(BIGNUM *r, const BIGNUM *a, const BIGNUM *p, BN_CTX *ctx)`<br />
a^p = r

`int BN_gcd(BIGNUM *r, const BIGNUM *a, const BIGNUM *b, BN_CTX *ctx)`<br />
aとbの最大公約数をrに入れる

すべての関数は成功すると1を返却し、失敗すると0を返却します。

# 比較
`int BN_cmp(BIGNUM *a, BIGNUM *b)`を使うと**BIGNUM**の値同士を比較することが出来ます。
`int BN_ucmp(BIGNUM *a, BIGNUM *b)`はaとbの絶対値同士を比較します。
戻り値が-1ならa < b、戻り値が0ならa == b、戻り値が1ならa > bです。

`int BN_is_zero(BIGNUM *a)`<br />
`int BN_is_one(BIGNUM *a)`<br />
`int BN_is_odd(BIGNUM *a)`<br />
を使うと、それぞれ値が0か、1か、奇数かを調べることが出来ます。

`int BN_is_word(BIGNUM *a, BN_ULONG w)`はaとwの値が等しいかどうかを調べます。

---

long型との計算（BN_add_word）や素数の生成（BN_generate_prime）、ビット単位の操作（BN_set_bit）なんかもあって何かすごいのだけれど、体力と気力が持たないので一旦公開しちゃいます。気合が入ったら追記するかも。
ドキュメントを翻訳する人ってすごいんだなってのを身に染みて感じた。ありがたい限りです。
