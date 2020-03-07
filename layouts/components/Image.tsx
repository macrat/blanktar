import {FC} from 'react';
import {useAmp} from 'next/amp';

import colors from '../../lib/colors';


export type Props = {
    src: string,
    alt: string,
    width?: number,
    height?: number,
    title?: string,
    center?: boolean,
};


const Image: FC<Props> = ({src, alt, width, height, title, center=false}) => {
    const [_, w, h] = title?.match(/^([0-9]+)x([0-9]+)$/) || [];
    width = Number(String(width || w)) || undefined;
    height = Number(String(height || h)) || undefined;

    if (!width || !height) {
        throw `width or height is not provided: ![${alt}](${src})`;
    }
    if (!alt) {
        throw `alt is not provided: ![${alt}](${src})`;
    }

    if (useAmp()) {
        const image = (<>
            <amp-img src={src} alt={alt} width={String(width)} height={String(height)} layout="intrinsic" />
            <style jsx>{`
                amp-img {
                    background-color: ${colors.darkbg};
                    margin: 1mm;
                }
            `}</style>
        </>);

        if (center) {
            return (<div>
                {image}

                <style jsx>{`
                    div {
                        text-align: center;
                    }
                `}</style>
            </div>);
        }
        return (<>{image}</>);
    }

    return (<>
        <img src={src} alt={alt} width={String(width)} height={String(height)} loading="lazy" />

        <style jsx>{`
            img {
                display: ${center ? "block" : "inline-block"};
                max-width: 100%;
                height: auto;
                background-color: ${colors.darkbg};
                margin: ${center ? "1mm auto" : "1mm"};
            }
        `}</style>
    </>);

};


export default Image;
