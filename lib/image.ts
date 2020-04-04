import {Image} from 'canvas';


export const loadImage = (src: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();

        img.onload = () => resolve(img);
        img.onerror = err => reject(err);

        img.src = src;
    })
};


export const detectSize = async (src: string) => {
    const img = await loadImage(src);

    return {
        width: img.naturalWidth,
        height: img.naturalHeight,
    };
};
