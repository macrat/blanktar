import {NextPage} from 'next';

import Article from '../components/Article';
import MetaData from '../components/MetaData';
import Image from '../components/Image';


export const config = {
    amp: 'hybrid',
};


export type Props = {};


const About: NextPage<Props> = () => (
    <Article title="about">
        <MetaData
            title="about"
            description="このサイトの作者であるMacRatのプロフィールです。"
            image="/img/macrat.png" />

        <Image alt="" width={256} height={256} src="/img/macrat.png" style={{
            width: '3cm',
            height: '3cm',
            borderRadius: '3cm',
        }} />

        <dl>
            <dt>名前</dt>
            <dd>志太 悠真</dd>
            <dt>ハンドルネーム</dt>
            <dd>MacRat</dd>
            <dt>メール</dt>
            <dd><a href="mailto:m@crat.jp" target="_blank" rel="noopener">m@crat.jp</a></dd>
            <dt>Twitter</dt>
            <dd><a href="https://twitter.com/macrat_jp" target="_blank" rel="noopener">@MacRat_jp</a></dd>
            <dt>Facebook</dt>
            <dd><a href="https://facebook.com/yuuma.shida" target="_blank" rel="noopener">yuuma.shida</a></dd>
            <dt>GitHub</dt>
            <dd><a href="https://github.com/macrat" target="_blank" rel="noopener">MacRat</a></dd>
            <dt>資格</dt>
            <dd>情報処理安全確保支援士（2018年登録, 登録番号: <a href="https://riss.ipa.go.jp/r?r=009528" target="_blank" rel="noopener">009528</a>）</dd>
            <dd>データベーススペシャリスト（2017年春）</dd>
            <dd>ネットワークスペシャリスト（2014年秋）</dd>
            <dd>情報セキュリティスペシャリスト（2013年秋）</dd>
            <dd>応用情報技術者（2013年春）</dd>
        </dl>
    </Article>
);


export default About;
