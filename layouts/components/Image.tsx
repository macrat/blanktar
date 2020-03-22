import {FC} from 'react';
import {useAmp} from 'next/amp';

import ImageComponent from '~/components/Image';


export type Props = {
    src: string,
    alt: string,
    width?: number,
    height?: number,
    title?: string,
    center?: boolean,
    style?: {
        [key: string]: string | number,
    },
};


const Image: FC<Props> = ({src, alt, width, height, title, center=false, style={}}) => {
    const [_, w, h] = title?.match(/^([0-9]+)x([0-9]+)$/) || [];
    width = Number(String(width || w)) || undefined;
    height = Number(String(height || h)) || undefined;

    if (!width || !height) {
        throw `width or height is not provided: ![${alt}](${src})`;
    }
    if (!alt) {
        throw `alt is not provided: ![${alt}](${src})`;
    }

    return <ImageComponent src={src} alt={alt} width={width} height={height} center={center} style={style} />
};


export default Image;
