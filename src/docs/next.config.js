const withCSS = require("@zeit/next-css");
const webpack = require("webpack");

const assetPath = process.env.ASSET_PATH || "/";

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
    },
});

module.exports = withCSS(
    withMDX({
        outDir: "../../docs/site",
        pageExtensions: ["js", "jsx", "md", "mdx"],
        assetPrefix: assetPath,
        webpack(config, options) {
            config.module.defaultRules = config.module.defaultRules || [];
            config.module.defaultRules.push({
                type: "javascript/auto",
                resolve: {},
            });
            config.module.rules.push(
                {
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
                },
                {
                    test: /\.json$/,
                    loader: "json-loader",
                },
                {
                    test: /\.wasm$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                publicPath: `${assetPath}_next/static/vendor/`,
                                outputPath: "static/vendor/",
                                name: "[hash].[ext]",
                            },
                        },
                    ],
                },
            );
            config.output = config.output || {};
            config.output.publicPath = `${assetPath}_next/static`;
            config.plugins.push(
                new webpack.DefinePlugin({
                    ROOT_PATH: process.env.NODE_ENV === "production" ? JSON.stringify("/greldal") : JSON.stringify(""),
                }),
                new webpack.IgnorePlugin(/mariasql/, /(\\|\/)knex(\\|\/)/),
                new webpack.IgnorePlugin(/mssql/, /(\\|\/)knex(\\|\/)/),
                new webpack.IgnorePlugin(/mysql/, /(\\|\/)knex(\\|\/)/),
                new webpack.IgnorePlugin(/mysql2/, /(\\|\/)knex(\\|\/)/),
                new webpack.IgnorePlugin(/oracle/, /(\\|\/)knex(\\|\/)/),
                new webpack.IgnorePlugin(/oracledb/, /(\\|\/)knex(\\|\/)/),
                new webpack.IgnorePlugin(/pg-query-stream/, /(\\|\/)knex(\\|\/)/),
                new webpack.IgnorePlugin(/sqlite3/, /(\\|\/)knex(\\|\/)/),
                new webpack.IgnorePlugin(/strong-oracle/, /(\\|\/)knex(\\|\/)/),
                new webpack.IgnorePlugin(/pg-native/, /(\\|\/)pg(\\|\/)/),
                new webpack.DefinePlugin({
                    "process.stdout.isTTY": false,
                }),
                // https://github.com/graphql/graphql-language-service/issues/128
                new webpack.ContextReplacementPlugin(
                    /graphql-language-service-interface[\\/]dist$/,
                    new RegExp(`^\\./.*\\.js$`)
                )
            );
            config.node = config.node || {};
            config.node.fs = "empty";
            return config;
        },
    }),
);
