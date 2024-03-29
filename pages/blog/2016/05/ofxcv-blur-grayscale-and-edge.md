---
title: ofxCvを使ってwebカメラの映像をぼかしたりグレーにしたり輪郭取ったり
pubtime: 2016-05-28T17:52:00+09:00
tags: [C++, openFrameworks, OpenCV, 画像処理]
image: [/blog/2016/05/ofxcv-blur-grayscale-and-edge.jpg]
description: openFrameworksでOpenCVを良い感じに扱うライブラリであるofxCvを使って、webカメラの映像を色々加工する実験をしてみました。
---

openFrameworksとOpenCVを組み合せると何か色々出来そうな気がするので、挑戦してみました。
標準で同梱されている[ofxOpenCv](http://openframeworks.cc/documentation/ofxOpenCv/)ってやつを試したのですが、何か使いづらいので、[ofxCv](https://github.com/kylemcdonald/ofxCv)に鞍替え。
まとまったドキュメントが見合たらないのがかなしいのですが、インターフェースは生のOpenCVと似ているのでC/C++向けのOpenCV経験者なら迷うことは無いと思います。

で。openFrameworksの機能でwebカメラの映像を取得して、ofxCvの機能で加工してみたいと思います。
やりたいのはこんな感じのことです。

![生の画像とぼかした画像、グレースケール、あと輪郭の画像をまとめたやつ。](/blog/2016/05/ofxcv-blur-grayscale-and-edge.jpg "640x480")

左上が生の映像、右上がガウシアンブラーをかけたやつ、左下がグレースケール、右下がCanny法で作った輪郭の映像です。

ソースコードはこんな感じ。
``` cpp
#include <ofMain.h>
#include <ofxCv.h>


class ofApp : public ofBaseApp {
private:
    ofVideoGrabber cam;
    ofImage blur, gray, edge;

public:
    void setup() override {
        cam.setup(320, 240);
    }

    void update() override {
        cam.update();

        if(cam.isFrameNew()){
            ofxCv::GaussianBlur(cam, blur, 16);
            ofxCv::convertColor(cam, gray, CV_RGB2GRAY);
            ofxCv::Canny(gray, edge, 50, 150);

            gray.update();
            edge.update();
            blur.update();
        }
    }

    void draw() override {
        cam.draw(0, 0);
        blur.draw(320, 0);

        gray.draw(0, 240);
        edge.draw(320, 240);
    }
};


int main() {
    ofSetupOpenGL(640, 480, OF_WINDOW);

    ofRunApp(new ofApp());
}
```

`ofVideoGrabber`ってクラスでwebカメラの映像を取得しています。
こいつは動画ファイルを読み込む事も出来るらしいので、リアルタイムの映像でなくてもいけます。

ofxCvの関数は`ofxCv`ってそのまんまの名前空間の中に入っています。分かりやすい。
OpenCVの関数はそのままの名前、ほぼそのままの呼び出し方で使えます。`cvtColor`が`convertColor`になっていたり、微妙に違うこともあるみたいです？

処理した後の画像は`update()`メソッドを呼び出してやらないと、`draw()`してもきちんと表示されないので注意が必要です。

だいたいそんなもんで。説明するまでもない感じが素敵ですね。
