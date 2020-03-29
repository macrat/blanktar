import Document, {Html, Head, Main, NextScript, DocumentContext} from 'next/document';


export default class BlanktarDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        return await Document.getInitialProps(ctx);
    }

    render() {
        return (
            <Html lang="ja">
                <Head />

                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
};
