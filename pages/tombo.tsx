import SearchBox from '../components/SearchBox';
import Article from '../components/Article';


const Tombo = () => (
    <>
        <SearchBox />

        <Article
            pubtime={new Date()}
            title="this is a content"
            tags={['test article', 'test', 'design', 'design test']}
            breadlist={[{
                title: 'tombo',
                href: '/tombo',
            }]}>

            <p>hello world!</p>

            <section>
                <h2>section!</h2>

                <p>hello</p>
                <p>hello!</p>
                <p>section!!</p>
            </section>
        </Article>
    </>
);


export default Tombo;
