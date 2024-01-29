import { Configuration } from "webpack";
const { merge } = require("webpack-merge");
const base = require("./webpack.base.conf");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// 压缩css
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 去掉没有用的js代码，webpack5 之后自带，不需要另行安装，直接引入使用即可
const TerserWebpackPlugin = require("terser-webpack-plugin");
// 对css/js进行gzip压缩
const CompressionWebpackPlugin = require("compression-webpack-plugin");

// postcss, 用js插件来转换样式的工具，处理css 文件，例如自动添加浏览器前缀，支持未被浏览器广泛支持的CSS语法
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
                            }
                        },
                    ]
                ],
            },
        },
    };
}
const config: Configuration = {
    mode: "production",
    // 通常生产环境需要
    optimization: {
        minimize: true,
        minimizer: [new CssMinimizerPlugin(), new TerserWebpackPlugin()],
        // 代码分割
        splitChunks: {
            chunks: 'all',
            // 生成 chunk 的最小体积
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
        // 清除上一次的打包结果
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "css/[name].[contenthash:7].css",
        }),
        // Webpack构建完成后，对输出目录中的资源文件进行压缩
        new CompressionWebpackPlugin({
            // [base]被[name] + [ext]所替代
            filename: "[path][base].gz",
            algorithm: "gzip",
            test: /\.js$|\.css$/,
            threshold: 10 * 1024, // 大于10kb才进行压缩
            minRatio: 0.8 // 压缩后的大小 / 原始大小 < 0.8 的文件才被压缩
        }),
    ],
};

module.exports = merge(base, config);
