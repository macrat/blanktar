import React, {FC, useEffect} from 'react';


export type Props = {
    children: () => void;
};


const Script: FC<Props> = ({children}) => {
    useEffect(() => children(), []);

    return (<></>);
};


export default Script;
