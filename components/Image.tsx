import React, { FC } from 'react';
import { useAmp } from 'next/amp';


export type Props = {
    src: string;
    alt: string;
    width: number;
    height: number;
    center?: boolean;
    style?: {
        [key: string]: string | number;
    };
};


const Image: FC<Props> = ({ src, alt, width, height, center=false, style={} }) => {
    const optimized = require(`../public${src}?url`);
    const webp = require(`../public${src}?url?webp`);
    const {trace} = require(`../public${src}?trace`);

    if (useAmp()) {
        const image = (<>
            <amp-img
                className="image"
                src={webp}
                alt={alt}
                width={String(width)}
                height={String(height)}
                style={style}
                layout="intrinsic">

                <amp-img
                    fallback
                    src={optimized}
                    width={String(width)}
                    height={String(height)} />
            </amp-img>

            <style jsx>{`
                .image {
                    background-image: url("${trace}");
                    margin: 1mm;
                }
            `}</style>
        </>);

        if (center) {
            return (<div>
                {image}

                <style jsx>{`
                    text-align: center;
                `}</style>
            </div>);
        }
        return (<>{image}</>);
    }

    return (<picture>
        <source
            type="webp"
            src={webp} />

        <img
            src={optimized}
            alt={alt}
            width={String(width)}
            height={String(height)}
            style={style}
            loading="lazy" />

        <style jsx>{`
            display: ${center ? "block" : "inline-block"};
            max-width: 100%;
            height: auto;
            background-image: url("${trace}");
            margin: ${center ? "1mm auto" : "1mm"};
        `}</style>
    </picture>);
};


export default Image;
