import { NextApiRequest, NextApiResponse } from 'next';


export default (req: NextApiRequest, res: NextApiResponse) => {
    console.log(JSON.parse(req.body));

    res.send('ok');
};
