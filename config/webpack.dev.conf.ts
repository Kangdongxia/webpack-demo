import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { merge } = require("webpack-merge");
const base = require("./webpack.base.conf");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const resolve = (dir: string) => path.resolve(__dirname, dir);

const config: Configuration = {
    mode: "development",
    devtool: "source-map", // 开启sourcemap
    stats: "errors-only",
    devServer: {
        port: "8080",
        static: false,
        // historyApiFallback: true, //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        historyApiFallback: {
			index: resolve('../src/index.html')
        },
        hot: true, //允许热加载
        compress: true, // 开启gzip压缩
        client: {
            logging: "error", // 设置devServer在浏览器上的日志级别
        },
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new ForkTsCheckerWebpackPlugin({
            async: true, // 异步检查，不阻塞webpack的编译
            typescript: {
                configFile: resolve("../tsconfig.json"),
            },
        }),
    ],
};

module.exports = merge(base, config);
