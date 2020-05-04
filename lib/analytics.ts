import {useEffect} from 'react';
import {useRouter} from 'next/router';
import ReactGA from 'react-ga';
import env from 'penv.macro';


ReactGA.initialize(
    process.env.GOOGLE_ANALYTICS ?? '',
    env({
        development: {
            debug: true,
            gaOptions: {
                siteSpeedSampleRate: 100,
            },
        },
    }, {}),
);


export default () => {
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
};
