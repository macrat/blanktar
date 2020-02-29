import Header from '../components/Header';
import SearchBox from '../components/SearchBox';
import Article from '../components/Article';
import ArticleHeader from '../components/blog/ArticleHeader';


const Tombo = () => (
    <main>
        <Header />

        <SearchBox />

        <Article>
            <ArticleHeader
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
            body {
                margin: 0;
            }
        `}</style>
    </main>
);


export default Tombo;
