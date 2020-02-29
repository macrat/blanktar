import Link from 'next/link';

import Article from '../components/Article';


const Index = () => (
    <Article>
        <ul>
            <li><Link href="/backdrop"><a>backdrop</a></Link></li>
            <li><Link href="/polygon"><a>polygon</a></Link></li>
            <li><Link href="/tombo"><a>tombo</a></Link></li>
            <li><Link href="/blog"><a>blog</a></Link></li>
        </ul>
    </Article>
);


export default Index;
