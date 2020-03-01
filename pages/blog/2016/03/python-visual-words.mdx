---
title: pythonでBag-of-Visual Wordsとやらを実装してみた。
pubtime: 2016-03-05T01:01+0900
tags: [python, Visual-Words, BoVW, opencv, sklearn, scikit-learn, akaze, numpy]
---

OpenCVとscikit-learnを組み合せて何か面白いことが出来ないか、なんて試行錯誤をしています。
画像の類似度を調べて何か出来そうな気がしたので、ひとまず類似度を調べてみることにしました。

画像が似ているかどうかを調べる方法として、**Bag-of-Visual Words**というのがあるそうです。**Bag-of-Words**っていう文書をベクトルとして表現する手法の応用だとか。
一枚一枚にベクトルを対応付けて、そのベクトルの距離で画像が似ているかどうかを判別するもののようです。
ま、難しいことは良いでしょう、とりあえず。

ここで掲載したプログラムを実行するには*python3*と*scikit-learn*、*OpenCV*、*numpy*が必要になります。適当にインストールしておいてください。

## 手順
大雑把に言うと、以下のような手順で**Visual Word**というものを作ります。

1. 全ての画像の特徴点(局所特徴量)を抽出する。
2. 抽出した特徴量を全部まとめてクラスタリングする。
3. クラスタリングで出来た代表点を**Visual Word**とする。

で、その後以下のようにして個々の画像の特徴ベクトルを計算します。

1. 特徴ベクトルが欲しい画像の特徴点を抽出する。
2. 各特徴点と最も近い**Visual Word**を探す。
3. 見つけた**Visual Word**に投票する。

投票ってのが謎ですが、要は特徴点をクラスタリングして、各クラスタに帰属した点の数を数えるイメージになります。

## Visual Wordを作ってみる
で、ここからは実際に書いたものを見ていくことにします。
全部実装したソースコードは末尾にありますが、最適化が入っているので見た目が違ったりします。ご了承ください。

### 特徴点を抽出する
特徴点の抽出には**AKAZE**ってやつを使いました。何か性能がとても良いらしい。
この特徴点の抽出アルゴリズムが非常に重要らしいので、色々試してみると良いかと思います。ちなみに私は試していません。

``` python
akaze = cv2.AKAZE_create()

features = []
for img in images:
    features.extend(akaze.detectAndCompute(img, None)[1])
```
だいたいこんな感じです。`images`はOpenCV形式の画像データが入った配列と思ってください。
`detectAndCompute`を使うと二次元の配列として特徴点の情報を返してくれるのでとても便利。

<PS date="2016-03-04">
コードの誤りを修正しました。
</PS>

### クラスタリングする
``` python
visual_words = MiniBatchKMeans(n_clusters=128).fit(features).cluster_centers_
```
どかーんとsklearnがやってくれます。素敵。
`n_clusters`というパラメータがクラスタの数になります。前述の通りクラスタの数はそのまま特徴ベクトルの次元数になりますので、この例だと128次元ということになります。
画像枚数にもよりますが、もっと次元を増やした方が良いような気がします。

## 特徴ベクトルを計算してみる
なんとこれだけでVisual Wordが出来てしまいました。もう全て終わったも同然です。
仕上げに特徴ベクトルを計算してみます。

``` python
features = akaze.detectAndCompute(img, None)[1]

vector = numpy.zeros(len(visual_words))
for f in features:
    vector[((visual_words - f)**2).sum(axis=1).argmin()] += 1
```
出来ました。心無しかややこしい処理が入っている気がしますが、気のせいです。
個々の特徴点について、全てのVisual Wordとの距離を計算して、一番近いものに投票する、というような手順になっています。

ここまでで必要なソースはほぼ出揃ったことになります。
理論を調べていると頭がごちゃごちゃしてくるのですが、手順は結構簡単で素敵ですね。

計算した特徴ベクトル同士の距離が近い画像は似ている画像、離れている画像は似ていない画像、ということになります。
なので、似ている画像が欲しいときはベクトルが近い画像を探せば良いことになります。

## 実行してみた
[Caltech 101](http://www.vision.caltech.edu/Image_Datasets/Caltech101/Caltech101.html)という画像データセットを使わせて頂いて実験をしてみました。
入っていた9,145枚の画像を全て学習させてもそこそこの時間で終わりました。結構速い。
なお、学習用のデータとテスト入力のデータには同一のものを仕様しました。適当です。

以下の画像を同じものを探してみます。

![入力に使った太極図](/blog/2016/03/visualwords-input.jpg)

類似度で上位20件の画像が以下の通り。

<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output1.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output2.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output3.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output4.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output5.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output6.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output7.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output8.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output9.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output10.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output11.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output12.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output13.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output14.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output15.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output16.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output17.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output18.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output19.jpg" />
<img style={{maxWidth: "6em"}} src="/blog/2016/03/visualwords-output20.jpg" />

適当に書いたプログラムですが、そこそこの精度が出ているようです。良い感じ。
パンダが出ているあたり色で見ているように思えますが、特徴点を使う方法では色は関係無い、はず。多分。

## おまけ。ソースコード
以下は軽く高速化を行なったプログラムになります。無尽蔵にキャッシュするようになっているので、そこそこのメモリが必要になるかもしれません。

``` python
import functools
import pathlib
import shutil

from sklearn.cluster import MiniBatchKMeans
import cv2
import numpy


input_dir = '/path/to/images/'
output_dir = '/path/to/save/'

akaze = cv2.AKAZE_create()
images = tuple(pathlib.Path(input_dir).glob('*.jpg'))


@functools.lru_cache(maxsize=1024)
def read_image(path, size=(320, 240)):
    img = cv2.imread(str(path))
    if img.shape[0] > img.shape[1]:
        return cv2.resize(img, (size[1], size[1]*img.shape[0]//img.shape[1]))
    else:
        return cv2.resize(img, (size[0]*img.shape[1]//img.shape[0], size[0]))


@functools.lru_cache(maxsize=None)
def load_kps(path):
    return akaze.detectAndCompute(read_image(path), None)[1]


def detect_all(verbose=False):
    for i, path in enumerate(images):
        if verbose:
            print('read {0}/{1}({2:.2%}) {3}'.format(i+1, len(images), (i+1)/len(images), path))

        try:
            yield from load_kps(path)
        except TypeError as e:
            print(e)


def make_visual_words(verbose=False):
    features = numpy.array(tuple(detect_all(verbose=verbose)))
    return MiniBatchKMeans(n_clusters=128, verbose=verbose).fit(features).cluster_centers_


def make_hist(vws, path):
    hist = numpy.zeros(vws.shape[0])
    for kp in load_kps(path):
        hist[((vws - kp)**2).sum(axis=1).argmin()] += 1
    return hist


def find_nears(vws, hist, n=5, verbose=False):
    nears = []
    for i, path in enumerate(images):
        if verbose:
            print('read {0}/{1}({2:.2%}) {3}'.format(i+1, len(images), (i+1)/len(images), path))

        try:
            h = make_hist(vws, path)
        except TypeError:
            continue

        nears.append((((h - hist)**2).sum(), h, path))
        nears.sort(key=lambda x:x[0])
        nears = nears[:n]
    return nears


if __name__ == '__main__':
    vws = make_visual_words(True)

    path = images[0]
    img = read_image(path)
    hist = make_hist(vws, path)

    nears = find_nears(vws, hist, n=20, verbose=True)
    for x in nears:
        print('{0:.2f} - {2}'.format(*x))
        shutil.copy(str(x[2]), '{0}{1:.2f}.jpg'.format(output_dir, x[0]))
```

---

参考：
- [Visual Wordsを用いた類似画像検索 - 人工知能に関する断創録](http://aidiary.hatenablog.com/entry/20100227/1267277731)
- [Bag of Visual Words - n_hidekeyの日記](http://d.hatena.ne.jp/n_hidekey/20111120/1321803326)
