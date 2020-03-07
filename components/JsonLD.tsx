import {FC} from 'react';


type Thing = {
    '@type': string,
    [key: string]: string | number | Thing | Thing[] | undefined,
};


export const Author: Thing = {
    '@type': 'Person',
    name: 'MacRat',
    url: 'https://blanktar.jp',
    sameAs: 'https://twitter.com/macrat_jp',
};


export const Publisher: Thing = {
    '@type': 'Organization',
    name: 'Blanktar',
};


export const Website: Thing = {
    '@type': 'Website',
    name: 'Blanktar',
    url: 'https://blanktar.jp',
    author: Author,
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://blanktar.jp/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
    },
};


export type Props = {
    data: Thing,
};


const JsonLD: FC<Props> = ({data}) => (
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        ...data,
        '@context': 'http://schema.org',
    })}} />
);


export default JsonLD;
