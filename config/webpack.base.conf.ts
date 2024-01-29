import { Configuration } from "webpack";
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
// 提取 JS 中引入的 CSS 打包到单独文件中, 以link标签的形式引入
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
            // 处理 CSS 文件中的@import和url()等语法， 将 CSS 转化成 CommonJS 模块
            loader: "css-loader",
            options: {
                // importLoaders: 1, // 为0没有任何影响
                modules:  {
                    localIdentName: "[local]--[hash:base64:5]", // css模块化方案
                    mode: (resourcePath: string) => {
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
    /*
    程序打包的入口，可以是字符串，字符串数组，对象或函数，正常情况下，单页面应用一个起点，多页面应用多个起点
    传入一个字符串或字符串数组，chunk 会被命名为 main。如果传入一个对象，则每个属性的键(key)会是 chunk 的名称
    */
    entry: resolve("../src/index.tsx"),
    output: {
        // 定义得到的bundle的名称，bundle会写入path指定的目录下
        filename: "js/[name].[contenthash:8].js",
        path: resolve("../output"),
        // 非初始chunk(包含按需加载或异步加载的模块, 代码分割产生的块)的chunk名称，运行时去生成，这些chunk也是动态加载,可减少页面首次加载的时间
        // 初始chunk(包含跟入口文件开始的相关的模块)会在页面首次加载时进行加载
        chunkFilename: "js/[name].[contenthash:4].js",
        // 修改静态资源（图片/图标/字体库）这些文件的命名规则，[ext] 是一个占位符，表示文件的扩展名
        assetModuleFilename: "images/[name].[contenthash:8][ext]",
        // 指定应用程序中所有资源的基础路径 （不影响js文件和html文件）,target为web, publicPath默认为auto
        publicPath: "auto"
    },
    target: "web",
    // webpack构建过程中产生的模块和在chunk被缓存，改善构建速度，生产模式被禁用
    cache: {
        // 从缓存读取时，会先查看内存缓存，如果内存缓存未找到，则降级到文件系统缓存。写入缓存将同时写入内存缓存和文件系统缓存。
        type: "filesystem",
        // 文件名发生变化缓存失效
        buildDependencies: {
            config: [__filename],
        },
    },
    // 设置模块如何被解析
    resolve: {
        // 解析文件路径时，如果路径没有文件后缀，尝试哪些后缀，过多的后缀可能会影响性能，因此只添加你实际使用的后缀即可
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        // 使用import或require 引用文件时，部分目录的别名，来确保模块引入变得更简单
        alias: {
            "@": resolve("../src"), // 这样配置后 @ 可以指向 src 目录
        },
    },
    // 如何处理项目中的模块
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
                            // 用默认的缓存目录node_modules/.cache/babel-loader 存储loader的执行结果，
                            // 后续webpack构建, 会尝试读取缓存， 默认值为false,不需要缓存
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
                        // 将 Less 编译为 CSS
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
                        maxSize: 4 * 1024, // 大于4kb抽离为单独文件，小于4kb时是一个Base64编码的字符串（dataurl）注入到包里
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
        // 产生一个html5文件，webpack构建生成的js, css文件以script/link标签被注入到head标签里
        new HtmlWebpackPlugin({
            //模板文件路径
            template: resolve("../src/index.html"),
            //模板文件名
            filename: "index.html",
            title: "webpack-demo",
            // 生成的html会用下面的配置项去压缩
            minify: {
                removeAttributeQuotes: true, //删除双引号,
                collapseWhitespace: true, //压缩成一行，
                removeComments: true, // 去掉注释
                keepClosingSlash: true
            },
        }),
        new WebpackBar({
            color: "#52c41a",
        }),
        // 静态资源不是通过import/require导入的，直接用的路径 <img src='./static/img.jpeg' alt="" />
        // 所使用的图片，需要被复制到输出目录中
        new CopyWebpackPlugin({
            patterns: [{ from: resolve("../src/static"), to: "static" }], // src/static目录下的资源, 复制到output/static目录下
        })
    ],
};

module.exports = config;
