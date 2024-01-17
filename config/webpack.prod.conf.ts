import { Configuration } from "webpack";
const { merge } = require("webpack-merge");
const base = require("./webpack.base.conf");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");


const getPostcssLoader = () => {
    return {
        loader: "postcss-loader",
        options: {
            postcssOptions: {
                plugins: [
                    [
                        "postcss-preset-env",
                        {
                            autoprefixer: {
                                grid: true
                            },
                        },
                    ],
                ],
            },
        },
    };
}
const config: Configuration = {
    mode: "production",
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), new TerserWebpackPlugin()],
        // 代码分割
        splitChunks: {
            chunks: 'all',
            minSize: 0,
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    getPostcssLoader(),
                ],
            },
            {
                test: /\.less$/,
                use: [
                    getPostcssLoader(),
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:7].css",
        }),
        new CompressionWebpackPlugin({
            filename: "[path][base].gz",
            algorithm: "gzip",
            test: /\.js$|\.css$/,
            threshold: 10 * 1024, // 大于10kb才进行压缩
            minRatio: 0.8,
        }),
    ],
};

module.exports = merge(base, config);
