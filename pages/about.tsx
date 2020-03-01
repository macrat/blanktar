import {NextPage} from 'next';

import Article from '../components/Article';


export type Props = {};


const About: NextPage<Props> = () => (
    <Article title="about">
        about me is not made yet
    </Article>
);


export default About;
