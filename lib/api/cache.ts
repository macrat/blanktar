import {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';


type ETagFunc = (req: NextApiRequest) => string;

type Opts = {
    etag: string | ETagFunc,
    control: string,
};


export default (handler: NextApiHandler, {etag, control}: Opts) => {
    const getEtag = typeof etag === 'string' ? (
        (req: NextApiRequest) => etag
    ) : (
        (req: NextApiRequest) => etag(req)
    );

    return async (req: NextApiRequest, res: NextApiResponse) => {
        const e = getEtag(req);

        res.setHeader('ETag', e);
        res.setHeader('Cache-Control', control);

        if (req.headers['if-none-match'] === e) {
            res.status(304).end();
            return;
        }

        await handler(req, res);
    }
};
