import {NextPage} from 'next';
import Link from 'next/link';

import posts from '../../../../lib/posts';


const MonthIndex: NextPage<{year: number, month: number}> = ({year, month}) => (
    <main>
        <h1>{year}/{month}'s blog</h1>

        <ol>
            {posts(year, month).map(x => (
                <li key={x}><Link href={`/blog/${year}/${String(month).padStart(2, '0')}/${x}`}><a>{x}</a></Link></li>
            ))}
        </ol>
    </main>
);


MonthIndex.getInitialProps = ({query}) => {
    return {
        year: Number(String(query.year)),
        month: Number(String(query.month)),
    };
};


export default MonthIndex;
