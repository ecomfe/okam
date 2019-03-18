# 第三方组件开发

> 如果想基于 Okam 框架开发第三方组件，可以采用下面方式进行开发发布。同时我们也欢迎大家把你们优秀的 UI 组件开源出来，帮助更多使用 Okam 开发的小伙伴们。具体可以通过[官方 Issue](https://github.com/ecomfe/okam/issues/29) 进行反馈回复，我们会统一进行整理归纳放到官方 [awesome](https://github.com/awesome-okam/awesome-okam) 文档里。


## 准备工作

* `okam-cli` 安装
    * `npm install okam-cli -g` 
    * 如果已经安装，确保 CLI 版本 `>= 0.1.11`，升级 `okam-cli`: `okam upgrade self`

## 项目初始化

```shell
okam init @okam/okam-components ${yourProjectName}
```

** 提示: ** `Okam 组件` 官方模板跟 CLI 是剥离开来的，具体可以查看 [Okam UI Template](https://github.com/awesome-okam/okam-online-templates/tree/master/templates/okam-components)。

## 组件开发

```shell
cd yourProjectName
npm i
```

具体开发，可以参考项目的示例代码，开发语法按 `Okam` 官方语法进行开发。

**注意：** 如果想用原生语法开发组件，本文档并不适用这种场景，`Okam` 也是支持直接引用第三方原生组件，具体参考[原生组件支持](component/nativeSupport)。

## 组件 Demo

```shell
cd yourProjectName/example
npm run init # 第一次执行需要执行该命令进行初始化
npm run dev
```

使用百度开发者工具打开 `example/dist` 构建目录，即可看到效果。具体组件示例撰写，可以参考 `example` 示例代码。更多使用说明，可以参考组件项目的 `README.md`。

## 组件发布

跟 `NPM` 包的发布流程一样，具体开发者根据自己情况进行发布，包括是否发布到自己私有仓库等。

## 组件使用

跟 `Vue` 第三方组件使用一样，在需要使用的项目安装对应的 `Okam` 组件 `NPM` 包，在引用的页面或者自定义组件地方通过 `components` 进行声明。如果组件找不到，请确认是否路径有误，如果组件引用路径有点长，可以通过 [resolve.alias](build/index.md?id=resolve) 构建配置进行自定义。





