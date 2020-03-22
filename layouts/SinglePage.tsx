import {FC} from 'react';

import MetaData from '~/components/MetaData';
import Article from '~/components/Article';
import ComponentsProvider from './components';


export type Props = {
    title: string,
    description: string | null,
    breadlist: {
        title: string,
        href: string,
        as?: string,
    }[],
    amp: boolean | 'hybrid',
};


export default ({title, description, breadlist, amp}: Props) => {
    if (!title) {
        throw `title is not provided: ${breadlist[breadlist.length - 1].title}`;
    }
    if (![true, false, 'hybrid'].includes(amp)) {
        throw `${title}: amp is not provided or invalid value: "${amp}"`;
    }
    if (!description && description !== null) {
        throw `${title}: description is not provided`;
    }

    const SinglePage: FC<{}> = ({children}) => (
        <Article title={title} breadlist={breadlist}>
            <MetaData title={title} description={description || undefined} />

            <ComponentsProvider>
                {children}
            </ComponentsProvider>
        </Article>
    );

    return SinglePage;
};
