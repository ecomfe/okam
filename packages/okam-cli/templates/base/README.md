${projectName}

====

${description}


## 开发前阅读

此项目是基于 `okam` 开发框架开发的小程序项目，开发前先了解：[Okam 的使用](https://ecomfe.github.io/okam)

## 快速开始

### 准备工作

* 安装 Node (`Node >= 8` && `npm >= 3`)

* 执行 `npm install`

### 开发

* 百度小程序运行命令

    * `npm run dev`：           带 watch 开发模式

    * `npm run dev:clean`：     删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:server`：    带 watch && 开发 Server 开发模式

    * `npm run build`：         删掉构建重新构建（没有 watch && 开发 Server）

    * `npm run prod`：          生产环境构建

* 微信小程序运行命令

    * `npm run dev:wx：`        微信小程序开发构建

    * `npm run dev:wx:clean`：  微信小程序：删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:wx:server`： 带 watch && 开发 Server 开发模式

    * `npm run prod:wx`：       微信小程序生产环境构建

* 支付宝小程序运行命令

    * `npm run dev:ant`：       微信小程序开发构建

    * `npm run dev:ant:clean`： 微信小程序：删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:ant:server`：带 watch && 开发 Server 开发模式

    * `npm run prod:ant`：      微信小程序生产环境构建

* 头条小程序运行命令

    * `npm run dev:tt`：       微信小程序开发构建

    * `npm run dev:tt:clean`： 微信小程序：删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:tt:server`：带 watch && 开发 Server 开发模式

    * `npm run prod:tt`：      微信小程序生产环境构建


* 快应用小程序运行命令

    * `npm run dev:quick`：       快应用小程序开发构建

    * `npm run dev:quick:clean`： 快应用小程序：删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:quick:server`：带 watch && 开发 Server 开发模式

    * `npm run prod:quick`：      快应用小程序生产环境构建

### 注意

#### 快应用开发
    * 需要全局安装 `hap` : `npm install adb-devtools -g`
    * 手机需要安装 `rpk` 包，[详见](https://doc.quickapp.cn/)
    * 快应用与小程序差异较多，框架提供基础功能，`UI` API, 对齐部分，需要开发对齐，详见示例 `src/common/component/Button`

### 目录结构说明

```
.
├── README.md
├── package.json
├── doc                     // 缓存项目源图片或者其它文档目录
├── dist                    // 百度小程序 构建产物，开发工具得选择该构建产物目录作为项目根目录方能预览
├── wx_dist                 // 微信小程序 构建产物，开发工具得选择该构建产物目录作为项目根目录方能预览
├── ant_dist                // 支付宝小程序 构建产物，开发工具得选择该构建产物目录作为项目根目录方能预览
├── tt_dist                 // 头条小程序 构建产物，开发工具得选择该构建产物目录作为项目根目录方能预览
├── .tinyimgcache           // 图片压缩的缓存信息，不可删掉，否则会导致图片重复压缩
├── project.json5           // 小程序项目配置文件，除了语法使用 JS 对象形式，配置说明参考官方小程序说明
├── scripts                 // 构建相关脚本
│   ├── build.js            // 构建入口脚本
│   ├── base.config.js      // 基础构建配置文件
│   ├── init-quick-app.js   // 快应用初始构建配置文件
│   ├── quick.config.js     // 快应用构建配置文件
│   ├── base.config.js      // 基础构建配置文件
│   ├── tt.config.js        // 头条小程序构建配置文件
│   ├── ant.config.js       // 支付宝小程序构建配置文件
│   ├── wx.config.js        // 微信小程序构建配置文件
│   └── swan.config.js      // 百度 Swan 小程序构建配置文件
└── src                     // 项目源码
    ├── app.${scriptExt}            // 小程序入口脚本
    ├── app.${styleExt}         // 小程序入口样式
    ├── common              // 项目公共代码
    │   ├── img             // 项目图片资源
    │   ├── tpl             // 项目公共模板文件
    │   └── ...
    ├── components          // 自定义组件
    └── pages               // 小程序页面集合
        ├── home            // 首页
        ├── ...
        └── ...
```

<% if: ${lint} !== 'lintnone' %>
### 代码规范说明
<% if: ${lint} === 'fecs' %>
fecs: https://github.com/ecomfe/fecs
<% /if %>
<% if: ${lint} === 'eslint' %>
eslint: https://github.com/ecomfe/eslint-config
<% /if %>
<% /if %>

### 文档
* [okam 使用教程](https://ecomfe.github.io/okam)
* [百度小程序](https://smartprogram.baidu.com/docs/develop/tutorial/codedir)
* [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/index.html)
* [支付宝小程序](https://docs.alipay.com/mini/developer/getting-started)
* [头条小程序](https://microapp.bytedance.com/docs/framework/)
* [快应用](https://doc.quickapp.cn/)

