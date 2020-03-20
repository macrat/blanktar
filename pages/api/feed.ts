import {NextApiRequest, NextApiResponse} from 'next';

import feed from '../../lib/feed';


export default (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=604800');

    res.send(feed);
};
