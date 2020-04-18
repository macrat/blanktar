import React, {FC, useState, useEffect, createContext, useContext as useReactContext} from 'react';
import Router from 'next/router';


type BlanktarContextValue = {
    loading: boolean;
    setLoading: (val: boolean) => void;
};


const BlanktarContext = createContext<BlanktarContextValue>({
    loading: false,
    setLoading: () => void 0,
});


export const useContext = () => useReactContext(BlanktarContext);


export const ContextProvider: FC = ({children}) => {
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

    return (
        <BlanktarContext.Provider value={{loading: loading, setLoading: setLoading}}>
            {children}
        </BlanktarContext.Provider>
    );
};
