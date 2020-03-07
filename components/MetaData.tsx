import {FC} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';


export type Props = {
    title?: string,
    description?: string,
};


const MetaData: FC<Props> = ({title, description}) => {
    const router = useRouter();

    return (
        <Head>
            <title>{title ? `${title} - Blanktar` : "Blanktar"}</title>
            {description ? <meta name="description" content={description} /> : null}

            <link rel="canonical" type="text/html" href={`https://blanktar.jp${router.asPath}`} />
        </Head>
    );
};


export default MetaData;
