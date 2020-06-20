import { createHash } from 'crypto';


export default (data: string) => `"${createHash('md5').update(data).digest('hex')}"`;
