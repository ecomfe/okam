# ChangeLog

## 2019-02-27

### okam-build@0.4.23

* **Bug修复**
    * 修复模板语法 `style` 绑定的变量存在换行解析有误 ([17eb1cd](https://github.com/ecomfe/okam/commit/17eb1cd))

* **新功能**
    * 增加 `.frameworkinfo` 文件用于 `百度小程序` ([bce74a3](https://github.com/ecomfe/okam/commit/bce74a3))

## 2019-02-25

### okam-build@0.4.22
* **新功能**
    * 增加 `v-html` 支持 ([071554d](https://github.com/ecomfe/okam/commit/071554d))

## 2019-02-20

### okam-core@0.4.14
* **Bug修复**
    * 修复 `Vuex` store 里引用类型修改比如 `array` 修改没能正确触发视图更新问题 ([358ad30](https://github.com/ecomfe/okam/commit/358ad30))
    * 修复 `支付宝` 自定义组件发射自定义事件，引用的自定义组件没有声明事件监听报错问题 ([ee7d68b](https://github.com/ecomfe/okam/commit/ee7d68b))


## 2019-02-14

### okam-build@0.4.21
* **Bug修复**
    * 修复 `okam-core` 依赖安装在项目源码根目录的父级目录依赖处理问题 ([cf16dfd](https://github.com/ecomfe/okam/commit/cf16dfd))

## 2019-02-10

### okam-build@0.4.20
* **Bug修复**
    * 修复模板 `style` 绑定的样式值存在逗号，比如 `transform` 样式属性值转换会出错，同时增加 `ES6 Template String` 支持 [#37](https://github.com/ecomfe/okam/issues/37) ([9814fc7](https://github.com/ecomfe/okam/commit/9814fc7))

## 2019-02-06

### okam-build@0.4.19
* **Bug修复**
    * 修复模板 `style` `class` 对于对象简写语法支持：`:style="{width, height}"` [#35](https://github.com/ecomfe/okam/issues/35) ([cb3a4f0](https://github.com/ecomfe/okam/commit/cb3a4f0))
    * 修复 `postcss` `plugins` 选项传递类似 `require('xx')(options)` 参数出错问题 [#36](https://github.com/ecomfe/okam/issues/36) ([12d554b](https://github.com/ecomfe/okam/commit/12d554b))

## 2019-01-30

### okam-build@0.4.18
* **Bug修复**
    * 修复模板 `style` 绑定变量存在三元表达式转换后样式出错问题 ([b5c0e49](https://github.com/ecomfe/okam/commit/b5c0e49))

### okam-core@0.4.12
* **Bug修复**
    * 修复页面组件 `createSelectorQuery` 新增扩展接口在 `微信小程序` SDK 版本 `2.1.3` 真机上出错问题 ([0bcb218](https://github.com/ecomfe/okam/commit/0bcb218))


## 2019-01-29

### okam-build@0.4.17
* **Bug修复**
    * 修复 win7 下组件找不到路径的问题 ([a777996](https://github.com/ecomfe/okam/commit/a777996))


## 2019-01-28

### okam-build@0.4.16
* **Bug修复**
    * 修复 头条自定义组件不支持 `dataset` 获取不到 `data-` 属性值，导致事件处理不生效问题 ([a207ae7](https://github.com/ecomfe/okam/commit/a207ae7))
    * 优化 `component-json` 处理器，组件按需文件处理替代同名文件处理、添加文件缺失提示 ([b6ca35d](https://github.com/ecomfe/okam/commit/b6ca35d))
    * 优化 `wx2swan` 处理器, 添加`wxs` 支持，仅限 `module.exports={fn}` 支持 ([973c8f9](https://github.com/ecomfe/okam/commit/973c8f9))

* **新功能**
    * 新增 `pages` 支持原生页面写法、添加文件缺失提示 ([8a4f123](https://github.com/ecomfe/okam/commit/8a4f123))


## 2019-01-25

### okam-core@0.4.15
* **新功能**
    * 增加 API `init` 钩子增加异步处理支持 ([66ec172](https://github.com/ecomfe/okam/commit/66ec172))


## 2019-01-24

### okam-build@0.4.14
* **Bug修复**
    * 修复 `postcss` `autoprefixer` 插件出现 JSON 序列化循环结构问题 ([baad1ee](https://github.com/ecomfe/okam/commit/baad1ee))


## 2019-01-23

### okam-cli@0.1.9
* **Bug修复**
    * 修复 模板 `useVuePrefix` 配置层级错误问题 ([0a66749](https://github.com/ecomfe/okam/commit/0a66749))


## 2019-01-22
### okam-core@0.4.10
* **Bug修复**
    * 修复 `支付宝小程序` 自定义组件 `createSelectorQuery` API 不存在问题，通过将接口定义直接代理到全局 `my.createSelectorQuery` 进行修复 ([950ac61](https://github.com/ecomfe/okam/commit/950ac61))
    * 修复 `支付宝小程序` 事件参数 `event.target.dataset` 跟微信实现没有对齐，将 `event.target.targetDataset` 赋值给 `event.target.dataset`，原先 `dataset` 值通过 `event.currentTarget.dataset` 获取 ([671360f](https://github.com/ecomfe/okam/commit/671360f))
    * 修复 `支付宝小程序` 自定义组件的 `ref` 信息丢失问题 ([68d7f42](https://github.com/ecomfe/okam/commit/68d7f42))
    * 修复 `v-model` 指令支持，在判断是否使用了 `observable data` 扩展问题 ([2df6341](https://github.com/ecomfe/okam/commit/2df6341))

* **新功能**
    * 增加 `Vuex` 状态管理库支持 ([e945934](https://github.com/ecomfe/okam/commit/e945934))

* **优化**
    * `redux` 扩展增加 `$subscribeStoreChange` `$unsubscribeStoreChange` API，将 `onShow` / `oHide` 钩子逻辑移到页面组件扩展里 ([7243ca1](https://github.com/ecomfe/okam/commit/7243ca1))
    * 优化 `observable array` 初始化逻辑 ([e945934](https://github.com/ecomfe/okam/commit/e945934))

### okam-build@0.4.13
* **Bug修复**
    * 修复 `filter` 模板语法，`class` 和 `style` 支持缺失问题 ([28343e8](https://github.com/ecomfe/okam/commit/28343e8))

* **新功能**
    * 增加 `Vuex` 状态管理库支持 ([817532e](https://github.com/ecomfe/okam/commit/817532e))

* **优化**
    * 移除原生自定义组件事件参数适配 ([2948a9b](https://github.com/ecomfe/okam/commit/2948a9b))

## 2019-01-16
### okam-core@0.4.9
* **Bug修复**
    * 修复页面组件 `createSelectorQuery` 新增扩展接口在 `微信小程序` SDK 版本 `2.1.3` 出错问题 ([3b7eb07](https://github.com/ecomfe/okam/commit/3b7eb07))

* **优化**
    * 优化快应用 `watch` `deep` 支持 ([fcb6fd2](https://github.com/ecomfe/okam/commit/fcb6fd2))

### okam-build@0.4.12
* **Bug修复**
    * 修复 `watch` 模式下，新增图片文件没有输出到构建目录 ([711e79e](https://github.com/ecomfe/okam/commit/711e79e))

* **新功能**
    * 对于 `百度小程序` 不支持 `for` `key` 属性配置，不再打印 `warning` 信息，同时 `key` 属性也会保留不会删除 ([5ff8855](https://github.com/ecomfe/okam/commit/5ff8855))
    * 增加模板和CSS资源依赖分析，同时重构原生组件模板依赖分析，新增构建配置 `component.template.resourceTags` 用于定制模板依赖资源分析 ([60a03d6](https://github.com/ecomfe/okam/commit/60a03d6))
    * `px2rpx` postcss 插件新增 `ignore` 选项，用于配置不想 `px` 转换的样式文件，默认 `node_modules` 下样式文件都不会转换 ([6b9ceea](https://github.com/ecomfe/okam/commit/6b9ceea))
    * 支持 `快应用` 不同页面组件放置在同一目录下 ([acdb588](https://github.com/ecomfe/okam/commit/acdb588))

* **优化**
    * `watch` 模式下，不再 `watch` `node_modules` 下依赖文件 ([feed692](https://github.com/ecomfe/okam/commit/feed692))

### okam-cli@0.1.8
* **新功能**
    * 支持快应用 ([19ca00e](https://github.com/ecomfe/okam/commit/19ca00e))

* **优化**
    * 默认开启 `v-` 指令支持 ([19ca00e](https://github.com/ecomfe/okam/commit/19ca00e))

## 2019-01-11
### okam-core@0.4.8
* **新功能**
    * `v-model` 支持 ([26c6c0e](https://github.com/ecomfe/okam/commit/26c6c0e))
    * 新增 `快应用` 对于 `redux` 状态管理支持 ([8d8915d](https://github.com/ecomfe/okam/commit/8d8915d))

### okam-build@0.4.11
* **Bug修复**
    * 修复支付宝 `catch` 事件处理 ([a41606c](https://github.com/ecomfe/okam/commit/a41606c))

* **新功能**
    * `v-model` 支持 ([26c6c0e](https://github.com/ecomfe/okam/commit/26c6c0e))

### okam-cli@0.1.7
* **优化**
    * 去除支付宝默认依赖配置 `'@babel/preset-env'`, 更新模板 ([d1f18d9](https://github.com/ecomfe/okam/commit/d1f18d9))

## 2019-01-08
### okam-core@0.4.7
* **Bug修复**
    * 修复 `behavior` 扩展设置 `useNativeBehavior: false` 出错问题 ([a971f4a](https://github.com/ecomfe/okam/commit/a971f4a))

* **新功能**
    * 增加快应用对于 `mixin` `broadcast` `ref` `watch` `filter` 支持 ([a971f4a](https://github.com/ecomfe/okam/commit/a971f4a))
    * `behavior` 扩展支持自定义要使用 `okam` 实现特殊 `mixin` 的属性，基于 `mixinAttrs` 配置，同时也支持覆盖重写默认要特殊 `mixin` 属性。此外，也支持自定义要跟生命周期钩子一样 `mixin` 策略的方法属性，比如 `onShow`，基于 `mixinHooks` 配置，同时也支持覆盖重写默认要特殊 `mixin` 的钩子 ([a971f4a](https://github.com/ecomfe/okam/commit/a971f4a))
    * `broadcast` 扩展新增上下文属性 `$eventHub`，用于取代目前封装的 `$broadcast` 相关 API，建议后续使用广播扩展，都通过 `$eventHub` 来实现，该属性暴露出了 `on` `off` `emit` 等事件操作 API。之所以引入该属性，考虑到广播监听移除由开发者自行控制会合适些，其次快应用平台存在 `$broadcast` API 会冲突，且其含义跟扩展完全不同 ([a971f4a](https://github.com/ecomfe/okam/commit/a971f4a))

* **优化**
    * 优化 `mixin` (`behavior`) 扩展支持，默认所有 `okam` 的生命周期钩子都统一由 `okam` 完成 `mixin` （之前的 `created` 原生钩子由原生 `behavior` 实现），默认所有特殊属性 `data` `props` `computed` `methods` 都统一由 `okam` 完成 `mixin` (之前只有 `data` `props` `methods` 由原生 `behavior` 实现)，这样调整确保了所有平台的 `mixin` 策略一致性，而不依赖原生实现。 ([a971f4a](https://github.com/ecomfe/okam/commit/a971f4a))
    * 优化组件创建工厂兼容快应用平台，对于快应用使用全局对象缓存安装的扩展 ([a971f4a](https://github.com/ecomfe/okam/commit/a971f4a))
    * 优化组件 `props` 的规范化，允许传入 `{myProp: [String, Number]}` 多类型场景及其它附加配置 `{myProp: {type: String, validator() {}}}` ( `validator` 会被保留)，至于原生是否支持包括跨平台支持，需要开发者自行选择判断 ([a971f4a](https://github.com/ecomfe/okam/commit/a971f4a))

### okam-build@0.4.9
* **Bug修复**
    * 修复 `less` `import` 文件里的字体 `url` 路径没有正确 `resolve` ([dba9f1d](https://github.com/ecomfe/okam/commit/dba9f1d))

* **新功能**
    * 增加原生模板依赖的模板文件、自定义脚本文件依赖分析 ([2165030](https://github.com/ecomfe/okam/commit/2165030))
    * 增加快应用对于 `mixin` `broadcast` `ref` `watch` `filter` 及原生快应用组件支持支持 ([766d223](https://github.com/ecomfe/okam/commit/766d223))
    * 构建配置 `source.include` 支持传入 `glob` pattern 来附加引入要处理的文件，不局限于源目录 `src` 下文件，`node_modules` 也是可以([766d223](https://github.com/ecomfe/okam/commit/766d223))

* **优化**
    * 优化导入的模块路径 `resolve` ([766d223](https://github.com/ecomfe/okam/commit/766d223))
    * 优化头条原生组件支持 ([766d223](https://github.com/ecomfe/okam/commit/766d223))
    * 优化 `data` 扩展方法命名，不对外暴露方法改成 `__` 开头，不要尝试直接调用 `$setData` 方法 ([dfecb09](https://github.com/ecomfe/okam/commit/dfecb09))

### okam-cli@0.1.6
* **优化**
    * 优化 `okam` 包升级时判断条件 ([8fbdd92](https://github.com/ecomfe/okam/commit/8fbdd92))

* **新功能**
    * 增加在 `okam init` 之前升级工具本身选择功能 ([e185428](https://github.com/ecomfe/okam/commit/e185428))

## 2018-12-29
### okam-core@0.4.6
* **新功能**
    * 增加 `okam-core` 对外暴露 API，及新增 `platform` 相关 API，移除自动初始化平台信息逻辑 ([5a8e862](https://github.com/ecomfe/okam/commit/5a8e862))

* **优化**
    * 移除 `$api.okam` 里定义的 platform 扩展 API，改成通过[全局 API](https://ecomfe.github.io/okam/#/api/global) 方式暴露 ([67185c3](https://github.com/ecomfe/okam/commit/67185c3))

### okam-build@0.4.8
* **新功能**
    * 构建配置 `output.depDir` 支持对象形式，以配置不同模块依赖目录，默认只对 `node_modules` 目录进行处理 ([a2fd169](https://github.com/ecomfe/okam/commit/a2fd169))
    * 增加微信原生插件支持 ([e508cc7](https://github.com/ecomfe/okam/commit/e508cc7))
    * 新增构建配置 `resolve.alias` 和 `resolve.modules` 支持 ([08de455](https://github.com/ecomfe/okam/commit/08de455))

## 2018-12-27
### okam-core@0.4.4
* **Bug修复**
    * 修复 `微信小程序` 下引入 [contact 插件](https://work.weixin.qq.com/api/doc#90000/90136/91435) 导致 `数组` 类型数据修改比如 `push` 不更新问题 ([3dd5d4b](https://github.com/ecomfe/okam/commit/3dd5d4b))

* **优化**
    * `appGlobal` 对象初始化 ([5e9c0cf](https://github.com/ecomfe/okam/commit/5e9c0cf))

### okam-build@0.4.7
* **新功能**
    * 新增 `支付宝小程序` 原生自定义脚本及 `Vue Filter` 语法支持 ([a2fd169](https://github.com/ecomfe/okam/commit/a2fd169))

### okam-cli@0.1.5
* **Bug修复**
    * 修复包依赖配置 ([dc867d6](https://github.com/ecomfe/okam/commit/dc867d6))

## 2018-12-25

### okam-core@0.4.3
* **Bug修复**
    * 修复对象类型数组 `splice` 赋值操作不更新问题 ([8b7745d](https://github.com/ecomfe/okam/commit/8b7745d))

* **优化**
    * 优化兼容小程序 `Function` 不支持情况 ([01f3290](https://github.com/ecomfe/okam/commit/01f3290))

### okam-core@0.3.5
* **优化**
    * 优化兼容小程序 `Function` 不支持情况 ([48a1612](https://github.com/ecomfe/okam/commit/48a1612))


## 2018-12-24

### okam-build@0.4.6

* **Bug修复**
    * 修复构建配置对于 `entry.script` 配置的 `merge` 丢失问题 [#23](https://github.com/ecomfe/okam/issues/23) ([b2214a8](https://github.com/ecomfe/okam/commit/b2214a8))
    * 修复增量构建时候，重复文件输出 ([51a8bad](https://github.com/ecomfe/okam/commit/51a8bad))

* **新功能**
    * 新增 `px2rpx` 插件对于 `1px` 不转换选项 ([0fb83dd](https://github.com/ecomfe/okam/commit/0fb83dd))
    * 新增 `Vue` 模板指令前缀支持，通过构建配置 `component.template.useVuePrefix` 启用 ([dc028b1](https://github.com/ecomfe/okam/commit/dc028b1))
    * 新增 `微信小程序` 和 `百度小程序`，`Vue filter` 语法支持，通过组件 `filters` 选项定义过滤器，通过构建配置 `framework` 新增 `filter` 扩展项支持 ([8bba3f1](https://github.com/ecomfe/okam/commit/8bba3f1))

* **优化**
    * 优化 babel 内置 `dep` 插件的配置 ([a83a305](https://github.com/ecomfe/okam/commit/a83a305))

### okam-core@0.4.2

* **优化**
    * 优化数组 slice API 操作，对于 `splice(idx, 1, newValue)` 操作转成数组索引赋值操作 ([6f30d48](https://github.com/ecomfe/okam/commit/6f30d48))

### okam-cli@0.1.4

* 更新模板配置

## 2018-12-19

### okam-build@0.4.5

* **Bug修复**
    * 修复 `px2rpx` 设置 `precision` 无效 ([fdbad10](https://github.com/ecomfe/okam/commit/fdbad10))
    * 修复模板的 `class` 绑定的对象定义换行转换失败问题 ([6c035ae](https://github.com/ecomfe/okam/commit/6c035ae))
    * 修复入口脚本的 globalData 存在 config 导致 App 的 config 配置丢失 [#20](https://github.com/ecomfe/okam/issues/20) ([afd943e](https://github.com/ecomfe/okam/commit/afd943e))

* **新功能**
    * 增加对 `百度小程序` 原生 `filter` 及 `微信小程序` `wxs` 脚本支持 ([e3a0e95](https://github.com/ecomfe/okam/commit/e3a0e95))

* **优化**
    * 优化构建异步任务，对于图片处理失败依旧正常输出图片文件 [#19](https://github.com/ecomfe/okam/issues/19) ([82a01ed](https://github.com/ecomfe/okam/commit/82a01ed))


## 2018-12-16

### okam-core@0.4.1

* **Bug修复**
    * 修复自定义组件 `$emit` 的事件详情数据为空变成空对象问题，改成保留原始的事件详情数据 ([c5a55cb](https://github.com/ecomfe/okam/commit/c5a55cb))
    * 修复内部方法错误显示 warning 信息 ([15f32a2](https://github.com/ecomfe/okam/commit/15f32a2))
    * 修复 `$nextTick` 嵌套情况下，没有触发嵌套的数据修改的 `$nextTick` 回调 ([bcb2d32](https://github.com/ecomfe/okam/commit/bcb2d32))

* **优化**
    * 移除组件 `$selector` 属性，`ref` 扩展现在对于引用非自定义组件不再使用 `createSelectorQuery` 查询节点作为 fallback，即 `ref` 模板属性只能引用自定义组件，页面组件新增 `createSelectorAPI` 以对齐原生自定义组件提供的 `createSelectorQuery` API ([007410e](https://github.com/ecomfe/okam/commit/007410e))
    * 优化模板事件代理新增的模板数据属性名称长度 ([8d44206](https://github.com/ecomfe/okam/commit/8d44206))

### okam-build@0.4.4
* **Bug修复**
    * 修复增量构建情况下，新增组件文件输出不该输出的文件 ([c36509f](https://github.com/ecomfe/okam/commit/c36509f))

* **优化**
    * 优化模板事件代理新增的模板数据属性名称长度 ([2bb0a0a](https://github.com/ecomfe/okam/commit/2bb0a0a))
    * 优化样式依赖路径的 `resolve` ([9aa7c75](https://github.com/ecomfe/okam/commit/9aa7c75))

## 2018-12-06

### okam-core@0.4.0
* **Bug修复**
    * 修复微信小程序的 `canvas` 组件的事件参数对象没有 `currentTarget` 属性导致事件监听报错问题。([4e93787](https://github.com/ecomfe/okam/commit/4e93787))

* **优化**
    * 重构 `ref` 实现，原先基于 `id` 查询引用组件改成基于 `class` 避免跟开发者定义 `id` 冲突 ([86480a5](https://github.com/ecomfe/okam/commit/86480a5))

### okam-build@0.4.0
* **Bug修复**
    * 修复使用原始 `css` 样式文件，没有处理 `import css` 问题 ([6bfb038](https://github.com/ecomfe/okam/commit/6bfb038))
    * 修复支付宝小程序 `canvas` 组件使用 `id` 而不是微信小程序 `canvas-id` 作为组件标识符不兼容问题，统一使用 `canvas-id` ([636570b](https://github.com/ecomfe/okam/commit/636570b))

* **优化**
    * 构建配置 `processors` 的处理器 `hook` 选项会重载而不是覆盖，即同一个处理器定义的多个 hook 都会被调用而不是覆盖  ([f0b318a](https://github.com/ecomfe/okam/commit/f0b318a))
    * 对于 `babel7` 的 `@babel/runtime` helper 代码路径进行重写：`/@babel/runtime/helpers/` 重写为 `/babel/` ([7e21c5f](https://github.com/ecomfe/okam/commit/7e21c5f))
    * 重构 `ref` 实现，原先基于 `id` 查询引用组件改成基于 `class` 避免跟开发者定义 `id` 冲突 ([e4e95b9](https://github.com/ecomfe/okam/commit/e4e95b9))


## 2018-12-05

### okam-core@0.4.0.beta-5
* **Bug修复**
    * 修复百度小程序从 `swan-core` `1.12` 开始会自动对自定义组件事件参数对象自动加一层包裹以对齐 `微信小程序`，即原先事件参数 `{counter: 2}` 会变成 `{type: 'counterChange', detail: {counter: 2}, counter: 2, currentTarget: {}, target: {}}`，如果碰巧你的事件参数包括 `detail` 信息，比如 `{detail: {c: 2}}` ，会导致变成 `{type: 'counterChange', detail: {detail: {c: 2}}, currentTarget: {}, target: {}}` 无法兼容原先代码。([9f82138](https://github.com/ecomfe/okam/commit/9f82138))

* **新功能**
    * 增加支付宝小程序 `refs` 支持  ([c9721a4](https://github.com/ecomfe/okam/commit/c9721a4))

* **优化**
    * `redux` 状态管理扩展，增加 `$fireStoreChange` API 及 优化 `redux` 状态变更检查  ([0ad3bb0](https://github.com/ecomfe/okam/commit/0ad3bb0))

### okam-core@0.3.4
* **Bug修复**
    * 修复百度小程序从 `swan-core` `1.12` 开始会自动对自定义组件事件参数对象自动加一层包裹以对齐 `微信小程序`，即原先事件参数 `{counter: 2}` 会变成 `{type: 'counterChange', detail: {counter: 2}, counter: 2, currentTarget: {}, target: {}}`，如果碰巧你的事件参数包括 `detail` 信息，比如 `{detail: {c: 2}}` ，会导致变成 `{type: 'counterChange', detail: {detail: {c: 2}}, currentTarget: {}, target: {}}` 无法兼容原先代码。([a47c63d](https://github.com/ecomfe/okam/commit/a47c63d))

### okam-build@0.4.0.beta-5
* **Bug修复**
    * 修复头条小程序升级后模板语法报错问题，之前模板对象语法允许两个花括号，现在跟微信对齐，必须三个花括号 ([ab3d3c3](https://github.com/ecomfe/okam/commit/ab3d3c3))

* **新功能**
    * 增加支付宝小程序 `refs` 支持  ([44fddbe](https://github.com/ecomfe/okam/commit/44fddbe))


## 2018-12-03

### okam-core@0.4.0.beta-2
* **优化**
    * 优化 `redux` 数据变更检查 [#11](https://github.com/ecomfe/okam/issues/11) ([d9d7cae](https://github.com/ecomfe/okam/commit/d9d7cae))

### okam-build@0.4.0.beta-3
* **Bug修复**
    * 修复 `less` 中使用 `@import` 导致编译文件丢失问题 ([f0aca25](https://github.com/ecomfe/okam/commit/f0aca25))
    * 修复 `sass` `scss` 语法写法不统一导致编译出错问题 ([ee06ae6](https://github.com/ecomfe/okam/commit/ee06ae6))


## 2018-12-02

### okam-build@0.4.0.beta-2
* **Bug修复**
    * 修复预处理语言依赖的样式文件没有编译也输出的问题 ([b1b67e4](https://github.com/ecomfe/okam/commit/b1b67e4))


## 2018-12-01

### okam-build@0.4.0.beta-1
* **Bug修复**
    * 修复 `win7` 下构建输出文件丢失问题 [#16](https://github.com/ecomfe/okam/issues/16) ([1fbcb40](https://github.com/ecomfe/okam/commit/1fbcb40))


## 2018-11-30

### okam-core@0.4.0.beta-0
* **`break change`**
    * 移除 App/页面/自定义组件实例上下文的 `$global` 属性([ec03a16](https://github.com/ecomfe/okam/commit/ec03a16))

* **新功能**
    * 增加扩展平台 API 能力支持 ([548bb9c](https://github.com/ecomfe/okam/commit/548bb9c))
    * 增加快应用支持 ([e328420](https://github.com/ecomfe/okam/commit/e328420))
    * 增加 `registerApi` API for App ([1380b59](https://github.com/ecomfe/okam/commit/1380b59))
    * 对于 `支付宝小程序` `getSystemInfo` API 增加`SDKVersion` 属性对齐微信小程序 ([1a79383](https://github.com/ecomfe/okam/commit/1a79383))
    * 对于 `支付宝小程序` 增加 `setNavigationBarTitle` API 对齐微信小程序 ([dbb9b2c](https://github.com/ecomfe/okam/commit/dbb9b2c))
    * 增加头条小程序支持 ([20a15a2](https://github.com/ecomfe/okam/commit/20a15a2))

### okam-build@0.4.0.beta-0
* **`break change`**
    * 变更构建配置 `component.template.transformTags` 模板标签转换配置定义，新增构建 API `reverseTagMap` 进行兼容转换，具体可以查看文档

* **新功能**
    * 增加特定平台相关样式定义支持: 基于媒介查询方式 ([b016e30](https://github.com/ecomfe/okam/commit/b016e30))
    * 增加构建配置 `script` 配置项，用于构建期间执行附加的脚本命令 ([fa7c6b4](https://github.com/ecomfe/okam/commit/fa7c6b4))
    * 增加构建配置 `component.global` 支持：提供全局组件自动注入能力 及 增加使用环境变量 `process.env.APP_TYPE` 定制特定平台脚本代码支持 ([ead6620](https://github.com/ecomfe/okam/commit/ead6620))
    * 支持特定平台配置能力支持 ([6be15a4](https://github.com/ecomfe/okam/commit/6be15a4))
    * 增加快应用支持、 全局 `API` 扩展支持 以及新增全局构建配置 `designWidth` 支持 ([fabbc3c](https://github.com/ecomfe/okam/commit/fabbc3c))
    * 增加特定平台的环境标签 Tag：`<${appType}-env>` ([c15dd06](https://github.com/ecomfe/okam/commit/c15dd06))
    * 增加特定平台相关样式定义支持: 基于特定平台属性前缀方式 `-${appType}-${styleProperty}: xxx` ([d028262](https://github.com/ecomfe/okam/commit/d028262))
    * 自动对快应用的文本内容加上 `<text></text>` 文本标签包裹 ([c860710](https://github.com/ecomfe/okam/commit/c860710))
    * 增加头条小程序支持 ([c516b79](https://github.com/ecomfe/okam/commit/c516b79))

* **优化**
    * 优化构建输出的资源文件：只输出依赖的资源文件，对于图片目前暂未优化，同时增加强制输出特定资源文件的能力支持 ([0097649](https://github.com/ecomfe/okam/commit/0097649))


## 2018-11-30

### okam-build@0.3.3

* **Bug修复**
    * 修复组件重复构建导致组件样式没有输出问题 [#13](https://github.com/ecomfe/okam/issues/13) ([96455ea](https://github.com/ecomfe/okam/commit/96455ea))


## 2018-11-26

### okam-core@0.3.3

* **Bug修复**
    * 修复微信小程序 computed 属性依赖的组件的 props 变化计算属性没有变化问题 [#10](https://github.com/ecomfe/okam/issues/10) ([a49f8f7](https://github.com/ecomfe/okam/commit/a49f8f7))


## 2018-11-26

### okam-core@0.3.2

* **Bug修复**
    * 修复 `百度小程序` 在新版 `regenerator-runtime` 下 `async await` 语法支持报错问题 ([5a621b1](https://github.com/ecomfe/okam/commit/5a621b1))

* **新功能**
    * `$interceptApis` 钩子支持对返回非 Promise 的异步 API的响应数据进行改写，即支持 `done` 钩子设置 ([35b6fea](https://github.com/ecomfe/okam/commit/35b6fea))


## 2018-11-15

### okam-build@0.3.1

* **Bug修复**
    * 修复 `支付宝小程序` 原生事件命名风格跟其它小程序不一致问题 ([2816599](https://github.com/ecomfe/okam/commit/2816599))
    * `支付宝小程序` 使用原生自定义组件事件处理出错问题 [#7](https://github.com/ecomfe/okam/issues/7) ([9bc800b](https://github.com/ecomfe/okam/commit/9bc800b))
    * 修复 `Babel7` 处理器编译问题，API 跟 `Babel6` 不一致 ([c6a4473](https://github.com/ecomfe/okam/commit/c6a4473))
    * 修复 `微信小程序` 使用 `localPolyfill` 有些代码写法没有分析到情况 [#2](https://github.com/ecomfe/okam/issues/2) ([f63bbcc](https://github.com/ecomfe/okam/commit/f63bbcc))

* **优化**
    * 文件构建改成按分析依赖的顺序进行构建 ([3f44454](https://github.com/ecomfe/okam/commit/3f44454))

### okam-core@0.3.1
* **新功能**
    * 增加 `支付宝小程序` 原生自定义组件的 `Okam` 框架适配器 ([0efded5](https://github.com/ecomfe/okam/commit/0efded5))
    * 增加 `支付宝小程序` `showToast` 原生 API 的适配，保持跟微信、百度小程序的 API 的统一 ([cc8fc34](https://github.com/ecomfe/okam/commit/cc8fc34))
    * 增加 `支付宝小程序` 数组数据操作优化，基于 `$spliceData` API ([20be465](https://github.com/ecomfe/okam/commit/20be465))

* **优化**
    * 废弃掉 `百度小程序` 使用的 `pushData` 等内部原生 API 进行 `数组` 数据操作优化的逻辑，考虑到这些接口暂未对外开放，且还有些 Bug ([c81b323](https://github.com/ecomfe/okam/commit/c81b323))
    * 优化原生 API 改写方式 ([a64f234](https://github.com/ecomfe/okam/commit/a64f234))

### okam-cli@0.1.0-alpha.0
* **新功能**
    * 增加 CLI 工具 ([3bfc69e](https://github.com/ecomfe/okam/commit/3bfc69e))


## 2018-11-09

### okam-build@0.3.0
* fix ant prop data observe ([a1ea9fa](https://github.com/ecomfe/okam/commit/a1ea9fa))
* add default babel parser options: {babelrc: false} ([7221830](https://github.com/ecomfe/okam/commit/7221830))
* add native swan component event handler adapter in okam ([410dbda](https://github.com/ecomfe/okam/commit/410dbda))
* disable transform click event to tap event for custom component ([60d098a](https://github.com/ecomfe/okam/commit/60d098a))

### okam-core@0.3.0
* fix ant component prop data observe ([c061f88](https://github.com/ecomfe/okam/commit/c061f88))
* fix ant custom component event emit ([fc53d2f](https://github.com/ecomfe/okam/commit/fc53d2f))
* fix ant page onload data reference problem ([25b8eab](https://github.com/ecomfe/okam/commit/25b8eab))
* fix mixin source plain object reference ([c8d16e6](https://github.com/ecomfe/okam/commit/c8d16e6))
* fix triggerEvent none event detail case ([3581107](https://github.com/ecomfe/okam/commit/3581107))
* add broadcast support ([9bba7a4](https://github.com/ecomfe/okam/commit/9bba7a4))
* add native swan component adapter to okam ([d1fa2ea](https://github.com/ecomfe/okam/commit/d1fa2ea))


## 2018-11-05

### okam-build@0.3.0-alpha.0
* fix ant app component page init ([0bba69c](https://github.com/ecomfe/okam/commit/0bba69c))
* fix ant class template syntax ([b20abf0](https://github.com/ecomfe/okam/commit/b20abf0))
* fix kebab case ref attribute value ([9302416](https://github.com/ecomfe/okam/commit/9302416))
* fix not throw error when devSever not enabled in replacement processor ([c6e6176](https://github.com/ecomfe/okam/commit/c6e6176))
* fix project config not exist case ([5951fe6](https://github.com/ecomfe/okam/commit/5951fe6))
* fix weixin template event transformation data-* style ([824af2f](https://github.com/ecomfe/okam/commit/824af2f))
* pad script file content when script exists ([85a8286](https://github.com/ecomfe/okam/commit/85a8286))
* add ant mixin support and internal mixin support ([819e3b6](https://github.com/ecomfe/okam/commit/819e3b6))
* add ant template transform support ([47eb7de](https://github.com/ecomfe/okam/commit/47eb7de))
* add global logger ([8a3aaa2](https://github.com/ecomfe/okam/commit/8a3aaa2))
* add postcss-plugin-wx2swan ([dfd22cc](https://github.com/ecomfe/okam/commit/dfd22cc))
* support ref multiple instances in template for loop ([52b14ea](https://github.com/ecomfe/okam/commit/52b14ea))

### okam-core@0.3.0-alpha.0
* add ant mixin support ([c575126](https://github.com/ecomfe/okam/commit/c575126))
* add na attribute for app/page/component ([172d58b](https://github.com/ecomfe/okam/commit/172d58b))
* add wx request optimize ([d812b97](https://github.com/ecomfe/okam/commit/d812b97))
* support ref multiple instances ([80fbdb2](https://github.com/ecomfe/okam/commit/80fbdb2))
* fix behavior init error in swan ([7e262b0](https://github.com/ecomfe/okam/commit/7e262b0))
* fix component import path ([0433b4c](https://github.com/ecomfe/okam/commit/0433b4c))
* fix extend computed prop existed in native and move extend lifecycle to methods for ant ([6e966a9](https://github.com/ecomfe/okam/commit/6e966a9))
* fix native api cannot promisify ([c3247f8](https://github.com/ecomfe/okam/commit/c3247f8))
* fix prop type null ([a79fa3a](https://github.com/ecomfe/okam/commit/a79fa3a))
* fix ref select all not fallback node select all ([36a5d7d](https://github.com/ecomfe/okam/commit/36a5d7d))
* fix request internal fetch function undefined in ant app ([2c893eb](https://github.com/ecomfe/okam/commit/2c893eb))
* fix watch not work in wx custom component ([0a7cdd0](https://github.com/ecomfe/okam/commit/0a7cdd0))
* remove native app component page wrap to fix ant native App/Component/Page undefined ([5dbf1f8](https://github.com/ecomfe/okam/commit/5dbf1f8))




