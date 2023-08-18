---
title: openFrameworksで画像を回す。そしてちゃんと笑い男する。
pubtime: 2016-05-28T19:51:00+09:00
tags: [C++, openFrameworks, OpenCV, 画像処理]
image: [/blog/2016/05/laughing-man-eyecatch.jpg]
description: openFrameworksを用いて画像（というか描画するもの全般）を回転させる方法です。ofxCvを使って作った笑い男プログラムの笑い男画像をきちんと回すようにしてみました。
---

[openFrameworks/ofxCvで笑い男を作った記事](/blog/2016/05/ofxcv-laughing-man)の続きです。
先程の記事では回りのリングが固定だったのですが、ちゃんと回るようにしてみます。

openFrameworksで描画するものを回転させるときには`ofRotate`というやつを使うようです。
ただ、このofRotateというやつを呼んでしまうと座標系が不思議なことになるので、他のものを描画するときに影響が出てしまいます。
そうなると困るので、`ofPushMatrix`と`ofPopMatrix`という二つの関数を使うことで影響を閉じ込めるようにして使用します。

文章だけだとややこしいので、ソースコードを。
``` cpp
#include <ofMain.h>
#include <ofxCv.h>


class ofApp : public ofBaseApp {
private:
    ofVideoGrabber cam;
    ofxCv::ObjectFinder finder;
    ofImage face, ring;
    int count;

public:
    void setup() override {
        cam.setup(640, 480);

        finder.setup("haarcascade_frontalface_default.xml");
        finder.setPreset(ofxCv::ObjectFinder::Fast);

        face.loadImage("face.png");
        ring.loadImage("ring.png");
    }

    void update() override {
        cam.update();

        if(cam.isFrameNew()){
            finder.update(cam);
        }
    }

    void draw() override {
        cam.draw(0, 0);

        for(int i=0; i<finder.size(); i++){
            ofRectangle rect = finder.getObjectSmoothed(i);

            {
                ofPushMatrix();

                ofTranslate(rect.getCenter());

                rect.width *= 1.5;
                rect.height *= 1.5;

                {
                    ofPushMatrix();

                    ofRotate(-count/2);
                    ring.draw(-rect.width/2, -rect.height/2, rect.width, rect.height);

                    ofPopMatrix();
                }

                face.draw(-rect.width/2, -rect.height/2, rect.width, rect.height);

                ofPopMatrix();
            }
        }

        count++;
    }
};


int main() {
    ofSetupOpenGL(640, 480, OF_WINDOW);

    ofRunApp(new ofApp());
}
```
コンパイルするときはOpenCVに同梱されている*haarcascade_frontalface_default.xml*と、笑い男の顔(face.png)、笑い男の後ろのリング(ring.png)の三つが必要です。
プロジェクトのディレクトリの`bin/data`以下に置いてください。

`draw`メソッドの中を見ていただくと、for文の中で妙なブロックを作っていることが目につくかと思います。
こいつは分かりやすいように書いただけで、プログラム的には何の意味もありません。
肝心なのはそのすぐ内側にある`ofPushMatrix`と`ofPopMatrix`です。この二つの関数で囲われた範囲で行なわれた座標系への操作(このプログラムでは`ofTranslate`と`ofRotate`)は外部に影響しません。
イメージ的には、ブロックの中の処理がブロックの外に影響しないよ、って感じですね。

`ofTranslate`というのは原点の座標を設定するための関数です。
初期状態で(0, 0)の位置に何かを描画しようとすると左上に描画されますが、例えば`ofTranslate(320, 240)`と呼んだあとに(0, 0)に描画しようとすると画面上の(320, 240)に描画されるようになります。
このプログラムでは、顔の中心を原点に設定するようにしています。
見栄えするように認識した矩形の1.5倍のサイズで描画させているのですが、ofTranslateを使用することでこういった処理がやりやすくなります。

肝心の画像を回転させる処理は`ofRotate`で行なっています。原点を中心にして回転するので、ここでもofTranslateの設定が効いています。
設定する値はDegreesらしいです。ラジアンじゃない普通の角度ですね。

そんな感じで、わりと簡単に画像を回すことが出来ました。
超簡単とはいかないけれど、この方法なら画像でなくても何だって歪ませたり回したり出来て楽しそうな感じですね。
だいぶ見辛くなるので、ブロックで囲うとかそういう工夫をした方が良いかもしれませんが…。

---

参考：
- [openFrameworks 入門編（２） - こじ研（openFrameworks）](http://www.myu.ac.jp/~xkozima/lab/ofTutorial2.html)
- [ofMesh | openFrameworks](http://openframeworks.cc/documentation/graphics/ofGraphics/#show_ofRotate)
