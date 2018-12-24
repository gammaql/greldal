const withCSS = require("@zeit/next-css");
const webpack = require("webpack");

const assetPath = process.env.ASSET_PATH || "/";

function mdxTableOfContents(options) {
    return require("mdx-table-of-contents").call(this, {
        ...options,
        minTableOfContentsLevel: 1,
        maxTableOfContentsLevel: 6,
    });
}

const withMDX = require("@zeit/next-mdx")({
    extension: /\.(md|mdx)$/,
    options: {
        mdPlugins: [
            require("remark-emoji"),
            require("remark-highlight.js"),
            require("remark-mermaid"),
            require("remark-slug"),
            require("remark-autolink-headings"),
            require("remark-html"),
            // require("remark-html-emoji-image"),
        ],
        compilers: [mdxTableOfContents],
    },
});

module.exports = withCSS(
    withMDX({
        outDir: "../../docs/site",
        pageExtensions: ["js", "jsx", "md", "mdx"],
        webpack(config, options) {
            config.module.rules.push({
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            publicPath: `${assetPath}_next/static/images/`,
                            outputPath: "static/images/",
                            name: "[hash].[ext]",
                        },
                    },
                ],
            });
            config.output = config.output || {};
            config.output.publicPath = `${assetPath}_next/static`;
            config.plugins.push(
                new webpack.DefinePlugin({
                    ROOT_PATH: process.env.NODE_ENV === "production" ? JSON.stringify("/greldal") : JSON.stringify(""),
                }),
            );
            return config;
        },
    }),
);
