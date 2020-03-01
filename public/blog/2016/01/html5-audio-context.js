navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

var canvas = document.querySelector('#mic_frequency_one');
var context = canvas.getContext('2d');

var two = document.querySelector('#mic_frequency_two');
var twoCtx = two.getContext('2d');

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
twoCtx.width = twoCtx.offsetWidth;
twoCtx.height = twoCtx.offsetHeight;

navigator.getUserMedia(
    {audio: true},
    function(stream){
        document.querySelector('audio').src = URL.createObjectURL(stream);
        var audioContext = new AudioContext();
        var analyser = audioContext.createAnalyser();
        var timeDomain = new Float32Array(analyser.frequencyBinCount);
        var frequency = new Uint8Array(analyser.frequencyBinCount);
        audioContext.createMediaStreamSource(stream).connect(analyser);

        var old = 0;
        var beacons = [];
        var beacon_max = Math.sqrt(Math.pow(two.width, 2) + Math.pow(two.height, 2));

        (function animation(){
            analyser.getFloatTimeDomainData(timeDomain);
            analyser.getByteFrequencyData(frequency);

            context.clearRect(0, 0, canvas.width, canvas.height);

            context.strokeStyle = 'blue';
            context.beginPath();
            context.moveTo(0, canvas.height - frequency[0]*canvas.height/255);
            for(var i=0; i<frequency.length; i++){
                context.lineTo(
                    i*canvas.width/frequency.length,
                    canvas.height - Math.max(0, frequency[i]*canvas.height/255)
                );
            }
            context.stroke();

            context.strokeStyle = 'red';
            context.beginPath();
            context.moveTo(0, canvas.height/2 + timeDomain[0]*canvas.height/2);
            for(var i=0; i<timeDomain.length; i++){
                context.lineTo(
                    i*canvas.width/timeDomain.length,
                    canvas.height/2 + timeDomain[i]*canvas.height/2
                );
            }
            context.stroke();

            var score = frequency.reduce(function(prev, current){
                return prev + current;
            });
            if(old*1.05 < score){
                beacons.push([0, old*50/score]);
            }
            old = score;

            twoCtx.clearRect(0, 0, two.width, two.height);
            twoCtx.fillStyle = 'black';

            beacons = beacons.filter(function(x){
                return x[0] < beacon_max;
            }).map(function(x){
                twoCtx.globalCompositeOperation = 'source-over';
                twoCtx.beginPath();
                twoCtx.arc(two.width, two.height, x[0], 0, Math.PI*2);
                twoCtx.fill();

                twoCtx.globalCompositeOperation = 'xor';
                twoCtx.beginPath();
                twoCtx.arc(two.width, two.height, x[0]+x[1], 0, Math.PI*2);
                twoCtx.fill();

                return [x[0]+10, x[1]];
            });

            twoCtx.beginPath();
            twoCtx.arc(two.width, two.height, score/timeDomain.length, 0, Math.PI*2);
            twoCtx.fill();

            requestAnimationFrame(animation);
        })();

    },
    console.log
);
