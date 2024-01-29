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
    // bundle中的哪些信息在会显示（发生错误时，bundle输出信息）
    stats: "errors-only",
    devServer: {
        port: "8080",
        static: false,
        // historyApiFallback: true, //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有404的响应将指向index.html
        historyApiFallback: {
			index: resolve('../src/index.html')
        },
        hot: true, // 启用模块热替换
        // 在Web开发中，服务器可以使用gzip来压缩响应的文本内容（如HTML、CSS、JavaScript等）。当浏览器支持gzip压缩，并在请求头中包含标识（Accept-Encoding: gzip， 表明浏览器支持gzip压缩算法），服务器可以将响应内容压缩后发送（在响应头加 Content-Encoding: gzip，表明响应内容使用了 gzip 压缩算法进行了压缩），浏览器收到后根据 Content-Encoding 字段来解压缩响应内容，并进行处理
        // 压缩文本内容可以显著减小文件的大小，减少网络传输时间，提高网页加载速度。这对于用户体验和性能优化非常重要
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
