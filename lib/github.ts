import fetch from 'node-fetch';

import Image from '~/lib/image';


export type Language = {
    name: string,
    color: string,
};


export type Repository = {
    name: string,
    description: string,
    url: string | null,
    image: null | {
        srcSet: string,
        mdpi: string,
        hdpi: string,
    },
    languages: Language[],
    updatedAt: string,
    createdAt: string,
};


type RawGitHubResponse = {
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


const fetchGitHub: (() => Promise<Repository[]>) = async () => {
    const resp = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `token ${process.env.GITHUB_TOKEN}`,
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
        throw new Error(`failed to fetch GitHub data: ${resp.status} ${resp.statusText}`);
    }

    const {data}: RawGitHubResponse = await resp.json();

    return await Promise.all(data.user.repositories.nodes.map(async repo => ({
        name: repo.parent?.nameWithOwner ?? repo.name,
        description: repo.description ?? '',
        url: repo.homepageUrl || repo.url,
        image: repo.usesCustomOpenGraphImage ? await (await Image.read(repo.openGraphImageUrl)).optimize('works', 640) : null,
        languages: repo.languages.nodes.map(lang => ({
            name: lang.name,
            color: lang.color,
        })),
        updatedAt: repo.updatedAt,
        createdAt: repo.createdAt,
    })));
};


export default fetchGitHub;
