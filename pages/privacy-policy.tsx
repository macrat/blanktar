import {NextPage} from 'next';
import Link from 'next/link';

import Article from '../components/Article';
import MetaData from '../components/MetaData';


export const config = {
    amp: 'hybrid',
};


export type Props = {};


const PrivacyPolicy: NextPage<Props> = () => (
    <Article title="プライバシーポリシー">
        <MetaData
            title="プライバシーポリシー"
            description="Blanktarのプライバシーポリシーです。" />

        <ol>
            <li>Blanktarでは、<a href="https://marketingplatform.google.com/intl/ja/about/analytics/" target="_blank">Google Analytics</a>を用いたアクセス解析を実施しています。</li>
            <li>アクセス解析は匿名で行なわれています。運営者であるMacRatが利用者個人を特定出来る情報を得る手段はありません。</li>
            <li>Google Analyticsは、<a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank">Googleの規約</a>に基づいて運用されています。詳しくは<a href="https://policies.google.com/technologies/partner-sites?hl=ja" target="_blank">Googleのドキュメント</a>を参照してください。</li>
            <li>疑問や不服があれば、<Link href="/about"><a>MacRat</a></Link>に問い合わせてください。</li>
        </ol>

        <style jsx>{`
            li {
                margin: .9em 0;
            }
        `}</style>
    </Article>
);


export default PrivacyPolicy;
