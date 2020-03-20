import {NextApiRequest, NextApiResponse} from 'next';

import sitemap from '../../lib/sitemap';


export default (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    res.send(sitemap);
};
