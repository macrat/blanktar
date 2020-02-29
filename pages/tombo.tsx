import {FC} from 'react';

import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import Article from '../components/Article';


const TagList: FC<{tags: string[]}> = ({tags}) => (
    <ul>
        {tags.map(x => (
            <li key={x}><a href="">test article</a></li>
        ))}

        <style jsx>{`
            ul {
                margin: 0;
                padding: 0;
            }
            li {
                display: inline-block;
                border: 1px solid #322;
                border-radius: 4px;
                margin: 2px 4px;
                position: relative;
            }
            li a {
                position: relative;
                color: #eee;
                text-decoration: none;
                display: inline-block;
                padding: 2px 4px;
                transition: color .1s ease;
            }
            a:focus {
                outline: none;
            }
            li:hover a, li:focus-within a {
                color: #322;
            }
            li::before {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                background-color: #322;
                transition: height .1s ease;
            }
            li:hover::before, li:focus-within::before {
                height: 0;
            }
        `}</style>
    </ul>
);


const date2str = (t: Date) => (
    `${t.getFullYear()}年${t.getMonth() + 1}月${t.getDate()}日 ${t.getHours()}:${t.getMinutes()}`
);


const ArticleMeta: FC<{pubtime: Date, title: string, tags: string[]}> = ({pubtime, title, tags}) => (
    <header>
        <time dateTime={pubtime.toISOString()}>{date2str(pubtime)}</time>
        <h1>{title}</h1>
        <TagList tags={tags} />

        <style jsx>{`
            header {
                margin-bottom: 2em;
            }
            h1 {
                font-size: 48pt;
                font-weight: 100;
                margin: -1.2rem 0 -.5rem;
                padding: 0;
            }
            time {
                display: inline-block;
                margin-left: 1em;
                font-size: 120%;
                font-weight: 200;
            }
        `}</style>
    </header>
);


const Tombo = () => (
    <main>
        <Header />

        <SearchBox />

        <Article>
            <ArticleMeta
                pubtime={new Date()}
                title="this is a content"
                tags={['test article', 'test', 'design', 'design test']} />

            <p>hello world!</p>

            <section>
                <h2>section!</h2>

                <p>hello</p>
                <p>hello!</p>
                <p>section!!</p>
            </section>
        </Article>

        <style jsx global>{`
            html {
                background-color: #eee;
                color: #322;
                font-family: 'Noto Sans JP', gothic, sans-serif;
                overflow: hidden auto;
            }
        `}</style>
    </main>
);


export default Tombo;
