import { NextApiRequest, NextApiResponse } from 'next';

import sitemap, { hash } from '~/lib/sitemap';
import withCache from '~/lib/api/cache';


export default withCache((req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');

    res.send(sitemap);
}, {
    etag: `"${hash}"`,
    control: 'public, max-age=604800',
});
