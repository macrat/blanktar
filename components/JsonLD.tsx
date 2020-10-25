import React, { ReactNode, ReactElement } from 'react';
import { Thing, Person, Organization, WebSite, WithContext } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';


export const Author: Person = {
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
} as Person;


export const Publisher: Organization = {
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
} as Organization;


export type Props<T extends Thing> = {
    data: WithContext<T>;
    children?: ReactNode;
};


const JsonLD = <T extends Thing>({ data }: Props<T>): ReactElement => (
    <JsonLd<WithContext<T>> item={data} />
);


export default JsonLD;
