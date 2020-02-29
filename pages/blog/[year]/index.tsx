import {NextPage} from 'next';
import Link from 'next/link';

import posts from '../../../lib/posts';

import Article from '../../../components/Article';


const YearIndex: NextPage<{year: number}> = ({year}) => (
    <Article title={`${year}'s blog`}>
        <ol>
            {posts(year).map(x => (
                <li key={x}><Link href={`/blog/${year}/${x}`}><a>{x}</a></Link></li>
            ))}
        </ol>
    </Article>
);


YearIndex.getInitialProps = ({query}) => {
    return {year: Number(String(query.year))};
};


export default YearIndex;
