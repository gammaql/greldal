import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
    static async getInitialProps({ renderPage }) {
        const sheet = new ServerStyleSheet();
        const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
        const styleTags = sheet.getStyleElement();
        return { ...page, styleTags };
        // const initialProps = await Document.getInitialProps(ctx);
        // return { ...initialProps };
    }

    render() {
        return (
            <html lang="id">
                <Head>
                    <meta charSet="utf-8" />
                    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                    <link rel="apple-touch-icon" sizes="57x57" href={`${ROOT_PATH}/static/favicons/apple-icon-57x57.png`} />
                    <link rel="apple-touch-icon" sizes="60x60" href={`${ROOT_PATH}/static/favicons/apple-icon-60x60.png`} />
                    <link rel="apple-touch-icon" sizes="72x72" href={`${ROOT_PATH}/static/favicons/apple-icon-72x72.png`} />
                    <link rel="apple-touch-icon" sizes="76x76" href={`${ROOT_PATH}/static/favicons/apple-icon-76x76.png`} />
                    <link rel="apple-touch-icon" sizes="114x114" href={`${ROOT_PATH}/static/favicons/apple-icon-114x114.png`} />
                    <link rel="apple-touch-icon" sizes="120x120" href={`${ROOT_PATH}/static/favicons/apple-icon-120x120.png`} />
                    <link rel="apple-touch-icon" sizes="144x144" href={`${ROOT_PATH}/static/favicons/apple-icon-144x144.png`} />
                    <link rel="apple-touch-icon" sizes="152x152" href={`${ROOT_PATH}/static/favicons/apple-icon-152x152.png`} />
                    <link rel="apple-touch-icon" sizes="180x180" href={`${ROOT_PATH}/static/favicons/apple-icon-180x180.png`} />
                    <link
                        rel="icon"
                        type="image/png"
                        sizes="192x192"
                        href={`${ROOT_PATH}/static/favicons/android-icon-192x192.png`}
                    />
                    <link rel="icon" type="image/png" sizes="32x32" href={`${ROOT_PATH}/static/favicons/favicon-32x32.png`} />
                    <link rel="icon" type="image/png" sizes="96x96" href={`${ROOT_PATH}/static/favicons/favicon-96x96.png`} />
                    <link rel="icon" type="image/png" sizes="16x16" href={`${ROOT_PATH}/static/favicons/favicon-16x16.png`} />
                    <meta name="msapplication-TileColor" content="#E535AB" />
                    <meta name="msapplication-TileImage" content={`${ROOT_PATH}/static/favicons/ms-icon-144x144.png`} />
                    <meta name="theme-color" content="#E535AB" />
                    {this.props.styleTags}
                </Head>
                <body className="custom_class">
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
