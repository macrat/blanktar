const Jimp = require('jimp');
const webp = require('imagemin-webp');
const Sharp = require('sharp');


(async () => {
    const img = await Jimp.read('../Desktop/test.jpeg');
    const buf = await img.getBufferAsync('image/jpeg');

    const out = await webp({
        lossless: false,
        quality: 60,
        method: 6,
    })(buf);

    console.log('jimp+imagemin:', out.length);
})();

(async () => {
    const out = await Sharp('../Desktop/test.jpeg')
        .webp({
            lossless: false,
            quality: 60,
            reductionEffort: 6,
        })
        .toBuffer();

    console.log('sharp only:   ', out.length);
})();
