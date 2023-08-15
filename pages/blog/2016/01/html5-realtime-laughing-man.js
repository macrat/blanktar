navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var video = document.createElement('video');
var laughing_canvas = document.querySelector('#laughing_man');
var laughingCtx = laughing_canvas.getContext('2d');

var first = true;
running = false;

//laughing_canvas.width = laughing_canvas.offsetWidth;
//laughing_canvas.height = laughing_canvas.offsetHeight;

var laughingman = new Image();
laughingman.src = '/blog/2016/01/laughing.png';

function run(){
    navigator.getUserMedia(
        {video: true},
        function(stream){
            video.src = URL.createObjectURL(stream);

            video.addEventListener('loadedmetadata', function(){
                (function animation(){
                    if(running){
                        laughingCtx.drawImage(video, 0, 0);

                        ccv.detect_objects({
                            'canvas': ccv.pre(laughing_canvas),
                            'cascade': cascade,
                            'interval': 5,
                            'min_neighbors': 1
                        }).forEach(function(x){
                            laughingCtx.drawImage(laughingman, x.x, x.y, x.width, x.height);
                        });
                    }

                    requestAnimationFrame(animation);
                })();
            });
        },
        console.log
    );
}

document.querySelector('#laughing_run_button').addEventListener('click', function(){
    running = true;
    if(first){
        run();
        first = false;
    }
});
document.querySelector('#laughing_stop_button').addEventListener('click', function(){
    running = false;
    laughingCtx.clearRect(0, 0, laughing_canvas.width, laughing_canvas.height);
});
