import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
// 想让设置的主题色生效，得用下面的方法引入antd.less， 这样会以单独的文件被css-loader处理，在配置里对他进行不被模块化的处理
import 'antd/dist/antd.less';
// 开始 js 的 HMR 热更新
if (module && module.hot) {
    module.hot.accept();
}

render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);
