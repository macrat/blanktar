import React, { FC } from 'react';
import { Thing, Person, Organization, WebSite } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';


export const Author: Person = {
    '@context': 'http://schema.org',
    '@type': 'Person',
    name: 'MacRat',
    familyName: 'SHIDA',
    givenName: 'yuuma',
    url: 'https://blanktar.jp',
    image: 'https://blanktar.jp/img/macrat.png',
    sameAs: [
        'https://twitter.com/macrat_jp',
        'https://www.instagram.com/macrat_jp/',
        'https://facebook.com/yuuma.shida',
    ],
};


export const Publisher: Organization = {
    '@context': 'http://schema.org',
    '@type': 'Organization',
    name: 'Blanktar',
    member: Author,
    logo: [{
        '@type': 'ImageObject',
        url: 'https://blanktar.jp/img/blanktar-banner.svg',
        width: 313,
        height: 60,
    }, {
        '@type': 'ImageObject',
        url: 'https://blanktar.jp/img/blanktar-banner.png',
        width: 313,
        height: 60,
    },  {
        '@type': 'ImageObject',
        url: 'https://blanktar.jp/img/blanktar-logo.svg',
    },  {
        '@type': 'ImageObject',
        url: 'https://blanktar.jp/img/blanktar-logo@512.png',
        width: 512,
        height: 512,
    },  {
        '@type': 'ImageObject',
        url: 'https://blanktar.jp/img/blanktar-logo@1024.png',
        width: 1024,
        height: 1024,
    }],
};


export const Website: WebSite = {
    '@context': 'http://schema.org',
    '@type': 'WebSite',
    name: 'Blanktar',
    url: 'https://blanktar.jp',
    author: Author,
    publisher: Publisher,
    potentialAction: {
        '@type': 'SearchAction',
        target: 'https://blanktar.jp/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
    },
};


export type Props = {
    data: Thing;
};


const JsonLD: FC<Props> = ({ data }) => (
    <JsonLd<Thing> item={data} />
);


export default JsonLD;
