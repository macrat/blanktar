---
title: ofxCvで笑い男をやってみた
pubtime: 2016-05-28T19:15:00+09:00
tags: [C++, openFrameworks, OpenCV, 画像処理]
image: [/blog/2016/05/laughing-man-eyecatch.jpg]
description: openFrameworksでOpenCVを使うためのライブラリであるofxCvを使って、Webカメラの映像から顔を見つけて笑い男の画像を重ねるプログラムを作ってみました。
---

画像処理のハローワールド的存在(？)である笑い男を**openFrameworks**の[ofxCv](https://github.com/kylemcdonald/ofxCv)でやってみました。
[python](/blog/2015/02/python-opencv-realtime-lauhgingman)とか[Web](/blog/2016/01/html5-realtime-laughing-man)とかでも笑い男書いたし、何かもう笑い男ばっかりやっている気がします。

![openFrameworksのofxCvで作った笑い男。](/blog/2016/05/ofxcv-laughing-man.jpg "640x480")

さて、ソースコード。
``` cpp
#include <ofMain.h>
#include <ofxCv.h>


class ofApp : public ofBaseApp {
private:
    ofVideoGrabber cam;
    ofxCv::ObjectFinder finder;
    ofImage laughingMan;

public:
    void setup() override {
        cam.setup(640, 480);

        finder.setup("haarcascade_frontalface_default.xml");
        finder.setPreset(ofxCv::ObjectFinder::Fast);

        laughingMan.loadImage("laughing_man.png");
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
            laughingMan.draw(rect);
        }
    }
};


int main() {
    ofSetupOpenGL(640, 480, OF_WINDOW);

    ofRunApp(new ofApp());
}
```

`ofxCv::ObjectFinder`で顔を検出して、見付かった矩形領域に画像を重ねているだけです。実にシンプル。
OpenCVに同梱されている*haarcascade_frontalface_default.xml*を*bin/dada*以下にコピーして、それから*bin/data/laughing_man.png*なる画像を用意してからコンパイルしてください。

検出の精度を決める`setPreset`の引数には`Fast`の他に`Accurate`や`Sensitive`なんてのがあるようです。ここを変えると精度やら速度やらが変わるはず。
Sensitiveにすると面白いほど誤検出します。Accurateはそこそこ。Fastが一番バランスが良い、ような気がします。

`getObjectSmoothed`なるメソッドで発見した顔の座標を取得していますが、`getObject`というメソッドを使うことも出来ます。
細かい意味は分かっていないのですが、getObjectを使うと座標が安定しないのに対して、getObjectSmoothedは平準化してくれているっぽい。
getObjectSmoothedの代わりにgetObjectを使うと、笑い男がの位置ががくがくと飛ぶようになります。

実に手軽に笑い男が出来てとても良い感じですね。
アルファチャンネルとか自分で考えなくて良いのが素晴しい。

笑い男の画像： [笑い男パーツ: マイペースなブログ](http://ledmyway.seesaa.net/article/181382754.html)
