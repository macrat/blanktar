import {NextPage, GetServerSideProps} from 'next';
import {FC} from 'react';
import fetch from 'node-fetch';

import Article from '~/components/Article';
import MetaData from '~/components/MetaData';
import DateTime from '~/components/DateTime';


export const config = {
    amp: 'hybrid',
};


const GITHUB_TOKEN = process.env.GITHUB_TOKEN;


type RawGithubResponse = {
    data: {
        user: {
            repositories: {
                nodes: {
                    name: string,
                    description: string | null,
                    url: string,
                    homepageUrl: string | null,
                    languages: {
                        nodes: {
                            name: string,
                            color: string,
                        }[],
                    },
                    parent: {
                        nameWithOwner: string,
                    } | null,
                    updatedAt: string,
                    createdAt: string,
                    openGraphImageUrl: string,
                    usesCustomOpenGraphImage: boolean,
                }[],
            },
        },
    },
};


export type Props = {
    github: {
        name: string,
        description: string,
        url: string | null,
        image: string | null,
        languages: {
            name: string,
            color: string,
        }[],
        updatedAt: string,
        createdAt: string,
    }[],
};


const LanguageList: FC<{languages: {name: string, color: string}[]}> = ({languages}) => (
    <ul aria-label="使用言語">
        {languages.map(lang => (
            <li key={lang.name} style={{backgroundColor: lang.color}}>
                <span style={{color: lang.color}}>{lang.name}</span>
            </li>
        ))}

        <style jsx>{`
            ul {
                display: block;
                margin: 0 -1mm;
                padding: 0;
            }
            li {
                display: inline-block;
                padding: 0 2mm;
                border-radius: 1mm;
                margin: 0 1mm;
            }
            span {
                filter: invert(100%) grayscale(100%) contrast(100);
            }
        `}</style>
    </ul>
);


const GithubRepository: FC<Props['github'][0]> = ({name, image, url, createdAt, updatedAt, languages, description}) => (
    <li style={{backgroundImage: image ? `url(${image})` : undefined}}>

        <a href={url || undefined} target="_blank" rel="noopener">
            <h3>{name}</h3>

            <span><DateTime dateTime={new Date(createdAt)} readableSuffix="公開" /> 〜 <DateTime dateTime={new Date(updatedAt)} readableSuffix="更新" /></span>

            <div><LanguageList languages={languages} /></div>

            <p>{description}</p>
        </a>

        <style jsx>{`
            li {
                display: block;
                width: calc(100% / 2 - 2mm * 2);
                height: 7cm;
                margin: 2mm;
                background-color: var(--colors-dark-fg);
                background-size: cover;
                background-position: center;
            }
            @media (max-width: 24cm) {
                li {
                    width: 100%;
                    height: auto;
                    margin: 2mm 0;
                }
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
                transition: color .2s ease;
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
                width: 100%;
                height: 100%;
                background-color: var(--colors-fg);
                transform: translate(-101%, 0);
                transition: transform .2s ease;
            }
            a:hover, a:focus {
                color: var(--colors-bg);
            }
            a:hover > *, a:focus > * {
                position: relative;
            }
            a:hover::before, a:focus::before {
                transform: translate(0, 0);
            }
            @media screen and (prefers-reduced-motion: reduce) {
                a::before {
                    transform: translate(0, 0);
                    opacity: 0;
                    transition: opacity: .2s ease;
                }
                a:hover::before, a:focus::before {
                    opacity: 1;
                }
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


const Works: NextPage<Props> = ({github}) => (
    <Article
        title="works"
        breadlist={[
            {title: 'works', href: '/works'},
        ]}>

        <MetaData
            title="works"
            description="MacRatが最近作っているものの一覧" />

        <div>
            <a href="https://github.com/macrat" target="_blank" rel="noopener">
                <h2>
                    <svg viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                    GitHub
                </h2>
            </a>
        </div>

        <ul aria-label="最近更新したGitHubのリポジトリ">
            {github.map(repo => (
                <GithubRepository key={repo.name} {...repo} />
            ))}
        </ul>

        <div>
            <a href="https://github.com/macrat?tab=repositories" className="view-more">
                もっと見る
            </a>
        </div>

        <style jsx>{`
            div {
                display: flex;
                justify-content: center;
            }
            h2 {
                display: flex;
                align-items: center;
                font-size: 48pt;
                font-weight: 200;
                margin: 0;
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

            ul {
                margin: 0;
                padding: 0;
                display: flex;
                flex-wrap: wrap;
            }

            .view-more {
                display: block;
                margin: 5mm 0 0;
                padding: 2mm 3mm;
                font-size: 130%;
                position: relative;
                overflow: hidden;
            }
            .view-more::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: var(--colors-fg);
                transform: scaleY(0);
                transition: transform .2s ease;
            }
            .view-more:hover, .view-more:focus {
                color: var(--colors-bg);
            }
            .view-more:hover::before, .view-more:focus::before {
                transform: scaleY(1);
                z-index: -1;
            }
            @media screen and (prefers-reduced-motion: reduce) {
                .view-more::before {
                    opacity: 0;
                    transform: scaleY(1);
                    transition: opacity .2s ease;
                }
                .view-more:hover::before, .view-more:focus::before {
                    opacity: 1;
                }
            }
        `}</style>
    </Article>
);


export const getServerSideProps: GetServerSideProps = async ({res}) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const resp = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `token ${GITHUB_TOKEN}`,
        },
        body: JSON.stringify({
            query: `{
              user(login: "macrat") {
                repositories(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
                  nodes {
                    name
                    description
                    url
                    homepageUrl
                    openGraphImageUrl
                    usesCustomOpenGraphImage
                    languages(first: 10, orderBy: {field: SIZE, direction: ASC}) {
                      nodes {
                        name
                        color
                      }
                    }
                    parent {
                      nameWithOwner
                    }
                    updatedAt
                    createdAt
                  }
                }
              }
            }`,
        }),
    });

    if (!resp.ok) {
        console.error(resp.status, resp.statusText);
        res.statusCode = 500;
        return {
            props: {
                github: [],
            },
        };
    }

    const data: RawGithubResponse = await resp.json();

    return {
        props: {
            github: data.data.user.repositories.nodes.map(repo => ({
                name: repo.parent?.nameWithOwner ?? repo.name,
                description: repo.description,
                url: repo.homepageUrl || repo.url,
                image: repo.usesCustomOpenGraphImage ? repo.openGraphImageUrl : null,
                languages: repo.languages.nodes.map(lang => ({
                    name: lang.name,
                    color: lang.color,
                })),
                updatedAt: repo.updatedAt,
                createdAt: repo.createdAt,
            })),
        },
    };
};


export default Works;
