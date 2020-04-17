import {Request as RequestMock, Response as ResponseMock, MockRequestOptions} from 'mock-http';


interface RequestOptions extends MockRequestOptions {
    query?: {
        [key: string]: string | string[];
    };
    cookies?: {
        [key: string]: string;
    };
    body?: any;
}


export class Request extends RequestMock {
    readonly query: {[key: string]: string | string[]};
    readonly cookies: {[key: string]: string};
    readonly body: any;

    constructor(options: RequestOptions = {}) {
        super(options);

        this.query = options.query ?? {};
        this.cookies = options.cookies ?? {};
        this.body = options.body;
    }

    get env() {
        return {};
    }
};


export class Response<T> extends ResponseMock {
    send<T>(data: T) {
        this.write(JSON.stringify(data));
    }

    json<T>(data: T) {
        this.send(data);
    }

    status(statusCode: number): Response<T> {
        this.statusCode = statusCode;
        return this;
    }

    setPreviewData(data: string | object, options?: {maxAge?: number | undefined} | undefined): Response<T> {
        return this;
    }

    clearPreviewData(): Response<T> {
        return this;
    }
};
