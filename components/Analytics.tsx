import {FC, useEffect} from 'react';
import {useRouter} from 'next/router';
import {useAmp} from 'next/amp';
import Head from 'next/head';
import ReactGA from 'react-ga';
import env from 'penv.macro';


const GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS ?? '';


ReactGA.initialize(
    GOOGLE_ANALYTICS,
    env({
        development: {
            debug: true,
            gaOptions: {
                siteSpeedSampleRate: 100,
            },
        },
    }, {}),
);


const Analytics: FC = () => {
    if (useAmp()) {
        return (
            <Head>
                <script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js" key="amp-analytics" />
                <amp-analytics type="gtag" data-credentials="include" key="amp-analytics--settings">
                    <script type="application/json" dangerouslySetInnerHTML={{__html: JSON.stringify({
                        vars: {
                            gtag_id: GOOGLE_ANALYTICS,
                            config: {
                                [GOOGLE_ANALYTICS]: {
                                    groups: 'default',
                                },
                            },
                        },
                    })}} />
                </amp-analytics>
            </Head>
        );
    }

    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            ReactGA.pageview(router.pathname);
        }, 0);
    }, [router.pathname]);

    useEffect(() => {
        const reportCSP = (ev: SecurityPolicyViolationEvent) => {
            ReactGA.event({
                category: 'CSP Report',
                action: ev.violatedDirective,
                label: ev.blockedURI,
                nonInteraction: true,
            });
        };

        document.addEventListener('securitypolicyviolation', reportCSP);
        return () => {
            document.removeEventListener('securitypolicyviolation', reportCSP);
        };
    }, []);

    return <></>;
};


export default Analytics;
