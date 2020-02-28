import {NextPage} from 'next';
import Link from 'next/link';

import posts from '../../../lib/posts';


const YearIndex: NextPage<{year: number}> = ({year}) => (
    <main>
        <h1>{year}'s blog</h1>

        <ol>
            {posts(year).map(x => (
                <li key={x}><Link href={`/blog/${year}/${x}`}><a>{x}</a></Link></li>
            ))}
        </ol>
    </main>
);


YearIndex.getInitialProps = ({query}) => {
    return {year: Number(String(query.year))};
};


export default YearIndex;
