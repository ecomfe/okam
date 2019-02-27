# 快速开始

## 准备工作

* Node 安装（要求 `Node >=8 && NPM >= 3`）

* 全局安装: `npm install okam-cli -g`

## 创建项目

Okam 的安装或更新都通过 `npm` 进行。

```
okam init my-okam-project

cd my-okam-project

npm install

```

!> 如果想支持 `快应用`，且需要 `多平台支持`，建议**优先开发快应用，再兼容其它平台**，由于快应用组件、API 和 样式差异性跟小程序比较大，此外各个平台组件对齐还有 API 目前需要开发者[自行实现](advance/platformSpecCode)。快应用开发模式跟小程序一样，具体差异点可以看各个章节文档说明。`快应用` 并没有像其它小程序平台提供了全局的 `API` 供访问，目前 `Okam` 框架参照 `微信小程序` 封装对齐了微信部分 API，建议开发者通过[扩展全局API方式](advance/platformSpecCode#API)来新增 API，不建议自行 `import clipboard from '@system.clipboard'` 方式来访问，除非你不考虑多平台支持，此外导入接口包一般情况下也不需要配置 `features`，具体可以参考[配置说明](app/entry#快应用配置)。`快应用` 样式跟其它小程序平台差异比较大，对此 `okam` 也做了一些兼容修复，需要在构建配置引入 `postcss` 插件 `quickcss`，具体配置可以参考[这里](build/processors#Postcss插件)。

## 运行调试

* 百度小程序运行命令

    * `npm run dev`：           带 watch 开发模式

    * `npm run dev:clean`：     删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:server`：    带 watch && 开发 Server 开发模式

    * `npm run build`：         删掉构建重新构建（没有 watch && 开发 Server）

    * `npm run prod`：          生产环境构建

* 微信小程序运行命令

    * `npm run dev:wx：`        微信小程序开发构建

    * `npm run dev:wx:clean`：  删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:wx:server`： 带 watch && 开发 Server 开发模式

    * `npm run prod:wx`：       微信小程序生产环境构建

* 支付宝小程序运行命令

    * `npm run dev:ant`：       支付宝小程序开发构建

    * `npm run dev:ant:clean`： 删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:ant:server`：带 watch && 开发 Server 开发模式

    * `npm run prod:ant`：      支付宝生产环境构建

* 头条小程序运行命令

    * `npm run dev:tt`：       头条小程序开发构建

    * `npm run dev:tt:clean`： 删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:tt:server`：带 watch && 开发 Server 开发模式

    * `npm run prod:tt`：      头条小程序生产环境构建

* 快应用运行命令

    * `npm run dev:quick`：       快应用开发构建

    * `npm run dev:quick:clean`： 删掉构建产物（不包括项目配置文件）并重新构建且带 watch 开发模式

    * `npm run dev:quick:server`：带 watch && 开发 Server 开发模式

    * `npm run prod:quick`：      快应用小程序生产环境构建

* 对于小程序，分别到小程序官网下载响应的开发者工具，打开开发工具，打开项目构建目录：`开发工具` -> `打开` -> `<项目Root>/dist`

    ```
    <项目Root>/dist         百度小程序
    <项目Root>/wx_dist      微信小程序
    <项目Root>/ant_dist     支付宝小程序
    ```


* 对于快应用，需要安装相应的工具，具体可以到[官网查看](https://doc.quickapp.cn/tutorial/getting-started/build-environment.html)，电脑上只需要全局安装 `hap-toolkit` 工具: `npm i hap-toollit -g`；手机上安装下官网提供的调试器即可。启动后，用手机扫码查看效果。

    ```
    <项目Root>/quick_dist         快应用构建目录
    <项目Root>/quick_dist/src     构建出来的快应用代码
    <项目Root>/quick_dist/build   快应用基于自己工具构建出来的代码
    <项目Root>/quick_dist/dist    快应用基于自己工具打包出来的代码
    ```

* 等待开发工具编译，就可以看到预览效果

## 更新工具或项目包

升级 `cli (okam-cli)`

```
okam upgrade self

```

升级 项目中 `okam 依赖(okam-build、okam-core、okam-xxx)`

```
// 替换成自己的 Okam 项目路径
cd <项目Root>

okam upgrade project
```

## 目录结构

目前目录结构规范，没有强制的要求，下面是我们推荐的一种目录结构：

```
.
├── README.md             // 项目说明文件
├── ci.yml                // 项目 CI 配置
├── package.json          // 项目包配置信息
├── doc                   // 放置项目源图片或者其它文档目录
├── dist                  // 百度小程序 构建产物，开发工具得选择该构建产物目录作为项目根目录方能预览
├── wx_dist               // 微信小程序 构建产物，开发工具得选择该构建产物目录作为项目根目录方能预览
├── ant_dist              // 支付宝小程序 构建产物，开发工具得选择该构建产物目录作为项目根目录方能预览
├── tt_dist               // 头条小程序 构建产物，开发工具得选择该构建产物目录作为项目根目录方能预览
├── quick_dist            // 快应用 构建产物，具体调试预览跟小程序不同，详见后面说明
├── .tinyimgcache         // 自动生成，图片压缩的缓存信息，不可删掉，否则会导致图片重复压缩
├── .frameworkinfo        // 百度小程序使用，不能删掉，也不能手动修改
├── project.json5         // 小程序项目配置文件，除了语法使用 JS 对象形式，配置说明参考官方小程序说明
├── scripts               // 构建相关脚本
│   ├── build.js          // 构建入口脚本
│   ├── build.sh          // CI 脚本
│   ├── base.config.js    // 基础构建配置文件
│   ├── tt.config.js      // 头条小程序构建配置文件
│   ├── init-quick-app.js // 快应用项目初始化脚本
│   ├── quick.config.js   // 快应用构建配置文件
│   ├── ant.config.js     // 支付宝小程序构建配置文件
│   ├── wx.config.js      // 微信小程序构建配置文件
│   └── swan.config.js    // 百度 Swan 小程序构建配置文件
└── src                   // 项目源码
    ├── app.js            // 小程序入口脚本
    ├── app.styl          // 小程序入口样式
    ├── common            // 项目公共代码
    │   ├── img           // 项目图片资源
    │   ├── tpl           // 项目公共模板文件
    │   └── ...
    ├── components      // 自定义组件
    └── pages           // 小程序页面集合
        ├── home        // 首页
        ├── ...
        └── ...
```

## 示例项目

* 基础项目：[okam-template](https://github.com/ecomfe/okam-template)
* 使用 `redux` 的 todo 项目：[okam-todo](https://github.com/The-only/okam-todo)
* 更多示例，可以参考 [awesome-okam](https://github.com/awesome-okam)

## 开发规范

* App 入口脚本，整体定义基本跟原生保持一致：

    ```javascript
    export default {
        config: { // 同原生的 app.json 定义
            pages: [
                'pages/home/index'
            ],

            window: {
                navigationBarBackgroundColor: '#211E2E',
                navigationBarTextStyle: 'white',
                backgroundTextStyle: 'light',
                enablePullDownRefresh: false,
                backgroundColor: '#ccc'
            },

            networkTimeout: {
                request: 30000
            }
        },

        // 其它定义，同原生 App 定义
        onLaunch() {}
    };
    ```

* 采用单文件组件化方式开发，组件的后缀名默认 `okm`，可以通过构建配置自定义。目前还没有相关的编辑器的语法扩展插件，你可以直接指定组件后缀名为 `Vue`，如果你已经安装了 `Vue` 相关的语法扩展插件，也可以通过文件名后缀自行关联。

* 小程序页面 `Page` 和自定义组件定义方式基本类似，`Page` 本质上也是组件，主要有两点不同

    * Page 没有 `props` 定义

    * 生命周期还有部分事件钩子不同，比如 Page 特有 `onShow` `onHide` 事件钩子，具体可以参考[组件章节](component/component.md)

* 组件定义，定义的属性方法避免使用 `$` 开头，`$` 开头定义的属于框架定义的内部属性、方法

* 注意避免 `data` `props` `computed` 定义的数据字段名称跟挂载到 组件实例上下文的已有方法、属性冲突，由于 `data` `props` `computed` 下的字段名经过框架转换后会被挂载到实例上下文，e.g，`data: {myName: 'xxx'}` 下的 `myName` 会被挂载到实例 `this` 下，即可以通过 `this.myName` 访问到对应的数据

* Page/自定义组件定义

```
<template>
    <view class="home-wrap">
         <view class="home-wrap">
            <button class="hello-btn" @click="onHello">{{computedProp}}</button>
            <view class="click-tip" if="clicked">You click me~</view>
        </view>
    </view>
</template>
<script>
import Hello from '../compoents/Hello';

export default {
    config: { // 同原生小程序配置，部分配置项提供缩略写法，比如 title
        title: 'Page Title'
    },

    props: {}, // 自定义组件支持

    components: { // 引入自定义组件，不需要在 config 里配置
        Hello
    },

    data: {
        btnText: 'Hello',
        clicked: false
    },

    computed: {
        computedProp() {
            return this.btnText + '-suffix';
        }
    },

    /* 生命周期或者其它Page钩子定义 */
    // 生命周期钩子
    created() {},
    mounted() {},
    destroyed() {},

    // Page 显示、隐藏钩子
    onShow() {},
    onHide() {},

    methods: {
        // 事件绑定方法，或者其它方法定义都放在这里
        onHello() {
            this.clicked = true;
            this.btnText = 'yyy'; // 直接赋值即可
        }
    }
};
</script>
<style lang="stylus">
</style>
```

!> Page 和自定义组件上下文还是原生小程序上下文，因此如果想依旧使用原生小程序方式开发，不使用提供的扩展 API 或者数据操作扩展，包括模板语言依旧使用原生的，也是允许的，但建议开发时候保持开发体验一致性。
