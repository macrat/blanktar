import React, { FC } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import LazyLoad from 'react-lazyload';

import fetchGitHub, { Repository, Language } from '~/lib/github';

import MetaData from '~/components/MetaData';
import Header from '~/components/Header';
import SearchBar from '~/components/SearchBar';
import Article from '~/components/Article';
import DateTime from '~/components/DateTime';
import ServiceBanner from '~/components/ServiceBanner';
import ViewMore from '~/components/ViewMore';


export type Props = {
    repositories: Repository[];
};


const LanguageListItem: FC<Language> = ({ name, color }) => (
    <li>
        <span>{name}</span>

        <style jsx>{`
            li {
                background-color: ${color};
                display: inline-block;
                padding: 0 2mm;
                border-radius: 1mm;
                margin: 0 1mm;
            }
            span {
                color: ${color};
                filter: invert(100%) grayscale(100%) contrast(100);
            }
        `}</style>
    </li>
);


const LanguageList: FC<{languages: Language[]}> = ({ languages }) => (
    <ul aria-label="使用言語">
        {languages.map(lang => (
            <LanguageListItem key={lang.name} {...lang} />
        ))}

        <style jsx>{`
            display: block;
            margin: 0 -1mm;
            padding: 0;
        `}</style>
    </ul>
);


const GithubRepository: FC<Repository> = ({ name, images, url, createdAt, updatedAt, languages, description }) => (
    <li>
        {images ? (
            <LazyLoad>
                <picture>
                    {images.reverse().map(img => (
                        <source key={img.mdpi} srcSet={img.srcSet} />
                    ))}

                    <img
                        width={640}
                        height={480}
                        srcSet={images[images.length - 1].srcSet}
                        src={images[images.length - 1].mdpi}
                        alt=""
                        aria-hidden="true" />
                </picture>
            </LazyLoad>
        ) : null}

        <a href={url === '' ? url : undefined} target="_blank" rel="noopener noreferrer">
            <h3 className="card-inner">{name}</h3>

            <span className="card-inner"><DateTime dateTime={new Date(createdAt)} readableSuffix="公開" /> 〜 <DateTime dateTime={new Date(updatedAt)} readableSuffix="更新" /></span>

            <div className="card-inner"><LanguageList languages={languages} /></div>

            <p className="card-inner">{description}</p>
        </a>

        <style jsx>{`
            li {
                display: block;
                width: calc(100% / 2 - 2mm * 2);
                height: 7cm;
                margin: 2mm;
                background-color: var(--colors-dark-fg);
                position: relative;
            }
            @media (max-width: 24cm) {
                li {
                    width: 100%;
                    height: auto;
                    margin: 2mm 0;
                }
            }
            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
                object-position: center;
            }
            a {
                display: block;
                width: 100%;
                height: 100%;
                padding: 5mm;
                box-sizing: border-box;
                color: inherit;
                text-decoration: none;
                color: var(--colors-fg);
                transition: color .2s;
                background-color: rgba(255, 255, 255, .7);
                overflow: hidden;
            }
            @media screen and (prefers-color-scheme: dark) {
                a {
                    background-color: rgba(0, 0, 0, .5);
                }
            }
            a::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                background-color: var(--colors-fg);
                transform: scaleY(0);
                transition: transform .2s;
            }
            a:hover, a:focus {
                color: var(--colors-bg);
            }
            a:hover::before, a:focus::before {
                transform: scaleY(1);
            }
            @media screen and (prefers-reduced-motion: reduce) {
                a::before {
                    transform: translate(0, 0);
                    opacity: 0;
                    transition: opacity: .2s;
                }
                a:hover::before, a:focus::before {
                    opacity: 1;
                }
            }
            .card-inner {
                position: relative;
            }
            h3 {
                font-size: 36pt;
                font-weight: 300;
                line-height: 1;
                margin: 0;
            }
            span {
                display: block;
                margin: 1mm 0 2mm;
                font-size: 90%;
            }
            p {
                font-size: 120%;
            }
        `}</style>
    </li>
);


const Works: NextPage<Props> = ({ repositories }) => (
    <>
        <MetaData
            title="works"
            description="MacRatが最近作っているものの一覧" />

        <Header />

        <SearchBar />

        <Article
            title="works"
            breadlist={[
                { title: 'works', href: '/works' },
            ]}>

            <ServiceBanner
                name="GitHub"
                href="https://github.com/macrat"
                viewBox="0 0 16 16"
                path="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />

            <ul aria-label="最近更新したGitHubのリポジトリ">
                {repositories.map(repo => (
                    <GithubRepository key={repo.name} {...repo} />
                ))}
            </ul>

            <div>
                <ViewMore href="https://github.com/macrat?tab=repositories" />
            </div>

            <style jsx>{`
                ul {
                    margin: 5mm 0 0;
                    padding: 0;
                    display: flex;
                    flex-wrap: wrap;
                }
                div {
                    text-align: center;
                }
            `}</style>
        </Article>
    </>
);


export const getStaticProps: GetServerSideProps<Props> = async () => ({
    props: {
        repositories: await fetchGitHub(),
        revalidate: 60,
    },
});


export default Works;
