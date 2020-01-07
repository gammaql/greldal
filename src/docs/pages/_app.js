import React from "react";
import App from "next/app";
import { PageLayout } from "../components/PageLayout";

export default class extends App {
    static async getInitialProps({ Component, router, ctx}) {
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        return { pageProps };
    }

    render() {
        const { Component, pageProps, router: { route } } = this.props;
        if (route.match(/\/api/) || route.match(/\/playground/)) {
            return (
                <Component {...pageProps} />
            );
        }
        return (
                <PageLayout>
                    <Component {...pageProps} />
                </PageLayout>
        );
    }
}
