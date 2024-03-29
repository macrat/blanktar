---
title: OpenSSLを使ってC言語でAES暗号
pubtime: 2014-10-07T15:43:00+09:00
tags: [C言語, OpenSSL, セキュリティ]
description: C言語でOpenSSLを使って、AES暗号の暗号化や復号を試してみました。若干面倒な手間が必要ですが、その分簡単に別のアルゴリズムに切り替えられるようです。
---

前回（[OpenSSLのBIGNUM関連の関数群に関するメモ](/blog/2014/10/openssl-bignum)）から引き続きOpenSSLです。暗号です。
C言語でOpenSSLを使ってAES暗号を扱ってみたので、テストコードを公開します。

EVPとかいうもので抽象化されていて、ちょっと煩雑な手続きが必要。
とはいえおかげで別の暗号化方式に切り替えるのは楽だから、まあ良し悪しだね。

# 暗号化
``` c
unsigned char* Encrypt(const char* key, const char* data, const size_t datalen, const unsigned char* iv, unsigned char* dest, const size_t destlen)
{
    EVP_CIPHER_CTX en;
    int i, f_len=0;
    int c_len = destlen;

    memset(dest, 0x00, destlen);

    EVP_CIPHER_CTX_init(&en);
    EVP_EncryptInit_ex(&en, EVP_aes_128_cbc(), NULL, (unsigned char*)key, iv);

    EVP_EncryptUpdate(&en, dest, &c_len, (unsigned char *)data, datalen);
    //EVP_EncryptFinal_ex(&en, (unsigned char *)(dest + c_len), &f_len);

    printf("c_len: %d\n", c_len);
    printf("f_len: %d\n", f_len);
    PrintBytes(dest, destlen);

    EVP_CIPHER_CTX_cleanup(&en);

    return dest;
}
```
鍵と暗号化したいデータ、初期ベクトルを渡すと、destに代入してくれる。

コメントアウトしている`EVP_EncryptFinal_ex`はデータ長が16Byteの倍数でないときにだけ必要になるようで、今回は要らないので省いてあります。
中途半端な長さのデータを渡した場合、Finalを呼んだ時にパディングしてうまいことやってくれるらしい。

初期ベクトルを使用しないとき（=暗号利用モードをEBCにするとき）は
``` c
EVP_EncryptInit_ex(&en, EVP_aes_128_ecb(), NULL, (unsigned char*)key, NULL);
```
のようにすればおっけー。

# 復号
``` c
unsigned char* Decrypt(const char* key, const unsigned char* data, const size_t datalen, const unsigned char* iv, char* dest, const size_t destlen)
{
    EVP_CIPHER_CTX de;
    int f_len = 0;
    int p_len = datalen;

    memset(dest, 0x00, destlen);

    EVP_CIPHER_CTX_init(&de);
    EVP_DecryptInit_ex(&de, EVP_aes_128_cbc(), NULL, (unsigned char*)key, iv);

    EVP_DecryptUpdate(&de, (unsigned char *)dest, &p_len, data, datalen);
    //EVP_DecryptFinal_ex(&de, (unsigned char *)(dest + p_len), &f_len);

    EVP_CIPHER_CTX_cleanup(&de);

    printf("p_len: %d\n", p_len);
    printf("f_len: %d\n", f_len);
    printf("%s\n", dest);
    PrintBytes(dest, destlen);

    return dest;
}
```
鍵とデータと初期ベクトルを渡して、destに代入。そのまんま。

`EVP_DecryptFinal_ex`については暗号化の時と同じ。パディングが必要なときに呼んでください。

初期ベクトルを使用しないのもほぼ暗号化の時と同じで、
``` c
EVP_DecryptInit_ex(&de, EVP_aes_128_ecb(), NULL, (unsigned char*)key, NULL);
```
という感じ。

# 動かしてみる
``` c
#include <string.h>
#include <stdio.h>
#include <openssl/evp.h>
#include <openssl/aes.h>
```
あたりをインクルード。

``` c
void PrintBytes(const unsigned char* bytes, const size_t length)
{
    int i;

    for(i=0; i<length; i++)
    {
        printf("%02x", bytes[i]);
    }
    printf("\n");
}
```
これはデバッグ用の関数。Encrypt、Decryptの中で使っています。

``` c
int main()
{
    const char key[] =  "abcdefghijklmnop";  // 暗号化に使う鍵。16バイト。
    const char data[] = "hello, OpenSSL! 123456789012345\0";  // 暗号化するデータ。ここでは32バイト。
    const unsigned char iv = "abcdefghijklmnop";  // 初期ベクトル。16バイト。

    unsigned char encode[32] = {'\0'};  // 暗号化したデータを入れる場所。
    char decode[32] = {'\0'};  // 複合したデータを入れる場所。

    printf("%s\n", data);
    PrintBytes(data, sizeof(data)-1);

    Encrypt(key, data, sizeof(data), iv encode, sizeof(encode));
    Decrypt(key, encode, sizeof(encode), iv, decode, sizeof(decode));

    return 0;
}
```
これがメイン関数。エンコードしてデコードするだけ。

---

楽ちんといえば楽ちんだし、そうでないといえばそうでない、かなぁ。
さくっとラッパ書いて使うほうが良いのかなぁ、という気がしないでもないです。どうだろう。


参考: [C言語でAESの暗号化・復号化を、opensslとmcryptで作ってみた：プログラマー社長のブログ：ITmedia オルタナティブ・ブログ](http://blogs.itmedia.co.jp/komata/2011/02/caesopensslmcry.html)
