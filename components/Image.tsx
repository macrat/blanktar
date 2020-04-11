import React, {FC} from 'react';
import {useAmp} from 'next/amp';


export type Props = {
    src: string,
    alt: string,
    width: number,
    height: number,
    center?: boolean,
    style?: {
        [key: string]: string | number,
    },
};


const Image: FC<Props> = ({src, alt, width, height, center=false, style={}}) => {
    if (useAmp()) {
        const image = (<>
            <amp-img
                src={src}
                alt={alt}
                width={String(width)}
                height={String(height)}
                style={style}
                layout="intrinsic" />

            <style jsx>{`
                background-color: var(--colors-block-bg);
                margin: 1mm;
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

    return (<>
        <img
            src={src}
            alt={alt}
            width={String(width)}
            height={String(height)}
            style={style}
            loading="lazy" />

        <style jsx>{`
            display: ${center ? "block" : "inline-block"};
            max-width: 100%;
            height: auto;
            background-color: var(--colors-block-bg);
            margin: ${center ? "1mm auto" : "1mm"};
        `}</style>
    </>);
};


export default Image;
