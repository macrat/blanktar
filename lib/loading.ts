import {useState, useEffect} from 'react';
import Router from 'next/router';


export default () => {
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const onStart = () => setLoading(true);
        const onComplete = () => setLoading(false);

        Router.events.on('routeChangeStart', onStart);
        Router.events.on('routeChangeComplete', onComplete);

        return () => {
            Router.events.off('routeChangeStart', onStart);
            Router.events.off('routeChangeComplete', onComplete);
        };
    }, []);

    return loading;
};
