import React, {FC} from 'react';
import {NextPage, GetServerSideProps} from 'next';
import LazyLoad from 'react-lazyload';

import fetchInstagram, {Photo} from '~/lib/instagram';

import MetaData from '~/components/MetaData';
import Header from '~/components/Header';
import SearchBar from '~/components/SearchBar';
import Article from '~/components/Article';
import ServiceBanner from '~/components/ServiceBanner';
import ViewMore from '~/components/ViewMore';


export type Props = {
    photos: Photo[];
};


const PhotoItem: FC<Photo> = ({url, images, trace, width, height, caption}) => (
    <figure>
        <svg
            width={width}
            height={height}
            viewBox={trace.viewBox}
            dangerouslySetInnerHTML={{__html: trace.path}}
            aria-hidden="true" />

        <LazyLoad offset={height/2}>
            <picture>
                {images.reverse().map(({srcSet, mdpi}) => (
                    <source key={mdpi} srcSet={srcSet} />
                ))}

                <img
                    srcSet={images[0].srcSet}
                    src={images[0].mdpi}
                    width={width}
                    height={height}
                    alt="" />
            </picture>
        </LazyLoad>
        <figcaption><a href={url}>{caption}</a></figcaption>

        <style jsx>{`
            figure {
                margin: 0;
                position: relative;
                overflow: hidden;
            }
            svg {
                width: 100%;
                height: auto;
                display: block;
                transition: transform .2s;
            }
            img {
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: auto;
                animation: show-image .4s;
                transition: opacity .2s, filter .2s, transform .2s;
            }
            @keyframes show-image {
                from { opacity: 0; }
                  to { opacity: 1; }
            }
            figcaption {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background-color: rgba(128, 128, 128, .5);
                opacity: 0;
                visibility: hidden;
                transition: opacity .2s, visibility .2s;
            }
            a {
                display: block;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                color: white;
                text-decoration: none;
                padding: 5mm;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: hidden;
                white-space: pre-wrap;
                transform: scaleY(0);
                transition: transform .2s;
            }
            a:hover, a:focus {
                color: white;
            }
            figure:hover img {
                opacity: .1;
                filter: contrast(4);
                transform: scale(1.1);
            }
            figure:hover svg {
                transform: scale(1.1);
            }
            figure:hover figcaption {
                opacity: 1;
                visibility: visible;
            }
            figure:hover a {
                transform: scaleY(1);
            }

            @media screen and (prefers-reduced-motion: reduce) {
                figure:hover img {
                    filter: contrast(4);
                    transform: scale(1);
                }
                figure:hover svg {
                    transform: scale(1);
                }
                a {
                    transform: scaleY(1);
                }
            }
        `}</style>
    </figure>
);


const Photos: NextPage<Props> = ({photos}) => (
    <>
        <MetaData
            title="photos"
            description="MacRatが撮った写真" />

        <Header />

        <SearchBar />

        <Article
            title="photos"
            breadlist={[
                {title: 'works', href: '/works'},
            ]}>

            <ServiceBanner
                name="Instagram"
                href="https://instagram.com/macrat_jp/"
                viewBox="0 0 36 36"
                path="M18 0c-4.889 0-5.501.02-7.421.108C8.663.196 7.354.5 6.209.945a8.823 8.823 0 0 0-3.188 2.076A8.83 8.83 0 0 0 .945 6.209C.5 7.354.195 8.663.108 10.58.021 12.499 0 13.11 0 18s.02 5.501.108 7.421c.088 1.916.392 3.225.837 4.37a8.823 8.823 0 0 0 2.076 3.188c1 1 2.005 1.616 3.188 2.076 1.145.445 2.454.75 4.37.837 1.92.087 2.532.108 7.421.108s5.501-.02 7.421-.108c1.916-.088 3.225-.392 4.37-.837a8.824 8.824 0 0 0 3.188-2.076c1-1 1.616-2.005 2.076-3.188.445-1.145.75-2.454.837-4.37.087-1.92.108-2.532.108-7.421s-.02-5.501-.108-7.421c-.088-1.916-.392-3.225-.837-4.37a8.824 8.824 0 0 0-2.076-3.188A8.83 8.83 0 0 0 29.791.945C28.646.5 27.337.195 25.42.108 23.501.021 22.89 0 18 0zm0 3.243c4.806 0 5.376.019 7.274.105 1.755.08 2.708.373 3.342.62.84.326 1.44.717 2.07 1.346.63.63 1.02 1.23 1.346 2.07.247.634.54 1.587.62 3.342.086 1.898.105 2.468.105 7.274s-.019 5.376-.105 7.274c-.08 1.755-.373 2.708-.62 3.342a5.576 5.576 0 0 1-1.346 2.07c-.63.63-1.23 1.02-2.07 1.346-.634.247-1.587.54-3.342.62-1.898.086-2.467.105-7.274.105s-5.376-.019-7.274-.105c-1.755-.08-2.708-.373-3.342-.62a5.576 5.576 0 0 1-2.07-1.346 5.577 5.577 0 0 1-1.346-2.07c-.247-.634-.54-1.587-.62-3.342-.086-1.898-.105-2.468-.105-7.274s.019-5.376.105-7.274c.08-1.755.373-2.708.62-3.342.326-.84.717-1.44 1.346-2.07.63-.63 1.23-1.02 2.07-1.346.634-.247 1.587-.54 3.342-.62 1.898-.086 2.468-.105 7.274-.105z M18 24.006a6.006 6.006 0 1 1 0-12.012 6.006 6.006 0 0 1 0 12.012zm0-15.258a9.252 9.252 0 1 0 0 18.504 9.252 9.252 0 0 0 0-18.504zm11.944-.168a2.187 2.187 0 1 1-4.374 0 2.187 2.187 0 0 1 4.374 0" />

            <ul>
                {photos.map((photo) => (
                    <li key={photo.url}>
                        <PhotoItem {...photo} />
                    </li>
                ))}
            </ul>

            <div className="view-more">
                <ViewMore href="https://instagram.com/macrat_jp/" />
            </div>

            <style jsx>{`
                div {
                    display: flex;
                    justify-content: center;
                    position: relative;
                    top: -20px;
                }

                h2 {
                    display: flex;
                    align-items: center;
                    font-size: 48pt;
                    font-weight: 200;
                }
                a {
                    color: inherit;
                    text-decoration: none;
                }
                a:hover, a:focus {
                    color: inherit;
                }
                svg {
                    margin-right: .2em;
                    width: 1em;
                    height: 1em;
                }
                path {
                    fill: var(--colors-fg);
                }

                ul, li {
                    display: block;
                    margin: 0;
                    padding: 0;
                }
                ul {
                    column-count: 3;
                    column-gap: 0;
                    position: relative;
                    margin: 5mm 0 0;
                }
                @media screen and (max-width: 24cm) {
                    ul {
                        column-count: 2;
                    }
                }
                @media screen and (max-width: 16cm) {
                    ul {
                        column-count: 1;
                    }
                }
                li {
                    break-inside: avoid;
                    page-break-inside: avoid;
                }
                ul::after {
                    content: '';
                    display: block;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    height: 80px;
                    background: linear-gradient(transparent, var(--colors-bg), var(--colors-bg));
                }
            `}</style>
        </Article>
    </>
);


export const getStaticProps: GetServerSideProps<Props> = async () => ({
    props: {
        photos: await fetchInstagram(),
    },
});


export default Photos;
