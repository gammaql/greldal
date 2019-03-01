import React from "react";
import App, { Container } from "next/app";
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
        if (route.match(/\/api/)) {
            return (
                <Container>
                    <Component {...pageProps} />
                </Container>
            );
        }
        return (
            <Container>
                <PageLayout>
                    <Component {...pageProps} />
                </PageLayout>
            </Container>
        );
    }
}
