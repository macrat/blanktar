import { Request as RequestMock, Response as ResponseMock, MockRequestOptions } from 'mock-http';


interface RequestOptions extends MockRequestOptions {
    query?: {
        [key: string]: string | string[];
    };
    cookies?: {
        [key: string]: string;
    };
    body?: any;  // eslint-disable-line @typescript-eslint/no-explicit-any
}


export class Request extends RequestMock {
    readonly query: {[key: string]: string | string[]};
    readonly cookies: {[key: string]: string};
    readonly body: any;  // eslint-disable-line @typescript-eslint/no-explicit-any

    constructor(options: RequestOptions = {}) {
        super(options);

        this.query = options.query ?? {};
        this.cookies = options.cookies ?? {};
        this.body = options.body;
    }

    get env() {
        return {};
    }
}


export class Response<T> extends ResponseMock {
    send(data: string | Buffer) {
        this.write(data);
    }

    json<T>(data: T) {
        this.send(JSON.stringify(data));
    }

    status(statusCode: number): Response<T> {
        this.statusCode = statusCode;
        return this;
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/ban-types */
    setPreviewData(data: string | object, options?: {maxAge?: number | undefined} | undefined): Response<T> {
        return this;
    }

    clearPreviewData(): Response<T> {
        return this;
    }

    getBody(): string {
        return this._internal.buffer.toString();
    }

    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    redirect(statusOrUrl: string | number, url?: string): Response<T> {
        return this;
    }
}
