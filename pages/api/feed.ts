import { NextApiRequest, NextApiResponse } from 'next';

import feed, { hash } from '~/lib/feed';
import withCache from '~/lib/api/cache';


export default withCache((req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8');

    res.send(feed);
}, {
    etag: `"${hash}"`,
    control: 'public, max-age=604800',
});
