import { Configuration } from "webpack";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const resolve = (dir: string) => path.resolve(__dirname, dir);
const isDevelopment = process.env.NODE_ENV === "development";

const getCommonCssLoader = () => {
    const loaders = [
        MiniCssExtractPlugin.loader,
        isDevelopment
            ? "@teamsupercell/typings-for-css-modules-loader"
            : undefined, // 自动生成.d.ts声明文件
        {
            loader: "css-loader",
            options: {
                // importLoaders: 1, // 为0没有任何影响
                modules:  {
                    localIdentName: "[local]--[hash:base64:5]", // css模块化方案
                    mode: (resourcePath: string) => {
                        console.log('resourcePath', resourcePath)
                        if (/antd\.(css|less)$/i.test(resourcePath)) {
                          return "icss";
                        }
                        return "local";
                    }
                },
                sourceMap: isDevelopment,
            },
        },
    ];
    return loaders.filter((item) => item !== undefined);
};

const config: Configuration = {
    entry: resolve("../src/index.tsx"),
    output: {
        filename: "js/[name].[contenthash:8].js",
        chunkFilename: "js/[name].[contenthash:8].js",
        assetModuleFilename: "images/[name].[contenthash:8].[ext]",
        publicPath: "auto",
        path: resolve("../output"),
    },
    target: "web",

    cache: {
        type: "filesystem",
        buildDependencies: {
            config: [__filename],
        },
    },
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
            "@": resolve("../src"), // 这样配置后 @ 可以指向 src 目录
        },
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: [
                    // 为什么使用require.resolve()
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [...getCommonCssLoader()],
            },
            {
                test: /\.less$/,
                use: [
                    ...getCommonCssLoader(),
                    {
                        loader: "less-loader",
                        options: {
                            sourceMap: isDevelopment,
                            lessOptions: {
                                modifyVars: {
                                    '@primary-color': '#1DA57A'
                                },
                                javascriptEnabled: true
                            },
                        },
                    },
                ],
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: 4 * 1024, // 大于4kb抽离为单独文件，小于4kb时为dataurl
                    },
                },
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2?)$/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            //模板文件路径
            template: resolve("../src/index.html"),
            //模板文件名
            filename: "index.html",
            title: "webpack-demo",
            minify: {
                removeAttributeQuotes: true, //删除双引号,
                collapseWhitespace: true, //压缩成一行，
                removeComments: true, // 去掉注释
            },
        }),
        new WebpackBar({
            color: "#52c41a",
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: resolve("../src/static/"), to: "static" }], // 该选项是指将public下的文件copy到output文件夹下，不包含public
        }),
    ],
};

module.exports = config;
