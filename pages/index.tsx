import Link from 'next/link';

import Article from '../components/Article';
import MetaData from '../components/MetaData';


const Index = () => (
    <Article>
        <MetaData />

        <ul>
            <li><Link href="/backdrop"><a>backdrop</a></Link></li>
            <li><Link href="/polygon"><a>polygon</a></Link></li>
            <li><Link href="/blog"><a>blog</a></Link></li>
        </ul>
    </Article>
);


export default Index;
