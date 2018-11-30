# ChangeLog


## okam-build@0.3.3 (2018-11-30)

### Bug Fixes

* **okam-build:** 修复组件重复构建导致组件样式没有输出问题 [#13](https://github.com/ecomfe/okam/issues/13) ([96455ea](https://github.com/ecomfe/okam/commit/96455ea))

## okam-core@0.3.3 (2018-11-26)

### Bug Fixes

* **okam-core:** 修复微信小程序 computed 属性依赖的组件的 props 变化计算属性没有变化问题 [#10](https://github.com/ecomfe/okam/issues/10) ([a49f8f7](https://github.com/ecomfe/okam/commit/a49f8f7))

## 0.3.2 (2018-11-26)

### Bug Fixes

* **okam-core:** 修复 `百度小程序` 在新版 `regenerator-runtime` 下 `async await` 语法支持报错问题 ([5a621b1](https://github.com/ecomfe/okam/commit/5a621b1))

### Features

* **okam-core:** `$interceptApis` 钩子支持对返回非 Promise 的异步 API的响应数据进行改写，即支持 `done` 钩子设置 ([35b6fea](https://github.com/ecomfe/okam/commit/35b6fea))


## 0.3.1 (2018-11-15)

### Bug Fixes

* **okam-build:** 修复 `支付宝小程序` 原生事件命名风格跟其它小程序不一致问题 ([2816599](https://github.com/ecomfe/okam/commit/2816599))
* **okam-build:** 修复 `支付宝小程序` 使用原生自定义组件事件处理出错问题 [#7](https://github.com/ecomfe/okam/issues/7) ([9bc800b](https://github.com/ecomfe/okam/commit/9bc800b))
* **okam-build:** 修复 `Babel7` 处理器编译问题，API 跟 `Babel6` 不一致 ([c6a4473](https://github.com/ecomfe/okam/commit/c6a4473))
* **okam-build:** 修复 `微信小程序` 使用 `localPolyfill` 有些代码写法没有分析到情况 [#2](https://github.com/ecomfe/okam/issues/2) ([f63bbcc](https://github.com/ecomfe/okam/commit/f63bbcc))
* **okam-core:** 废弃掉 `百度小程序` 使用的 `pushData` 等内部原生 API 进行 `数组` 数据操作优化的逻辑，考虑到这些接口暂未对外开放，且还有些 Bug ([c81b323](https://github.com/ecomfe/okam/commit/c81b323))

### Features

* **okam-build:** 文件构建改成按分析依赖的顺序进行构建 ([3f44454](https://github.com/ecomfe/okam/commit/3f44454))
* **okam-cli:** 增加 CLI 工具 ([3bfc69e](https://github.com/ecomfe/okam/commit/3bfc69e))
* **okam-core:** 增加 `支付宝小程序` 原生自定义组件的 `Okam` 框架适配器 ([0efded5](https://github.com/ecomfe/okam/commit/0efded5))
* **okam-core:** 增加 `支付宝小程序` `showToast` 原生 API 的适配，保持跟微信、百度小程序的 API 的统一  ([cc8fc34](https://github.com/ecomfe/okam/commit/cc8fc34))
* **okam-core:** 增加 `支付宝小程序` 数组数据操作优化，基于 `$spliceData` API ([20be465](https://github.com/ecomfe/okam/commit/20be465))

### Performance Improvements

* **okam-core:** 优化原生 API 改写方式 ([a64f234](https://github.com/ecomfe/okam/commit/a64f234))


## 0.3.0 (2018-11-09)

### Bug Fixes

* **okam-build:** fix ant prop data observe ([a1ea9fa](https://github.com/ecomfe/okam/commit/a1ea9fa))
* **okam-core:** fix ant component prop data observe ([c061f88](https://github.com/ecomfe/okam/commit/c061f88))
* **okam-core:** fix ant custom component event emit ([fc53d2f](https://github.com/ecomfe/okam/commit/fc53d2f))
* **okam-core:** fix ant page onload data reference problem ([25b8eab](https://github.com/ecomfe/okam/commit/25b8eab))
* **okam-core:** fix mixin source plain object reference ([c8d16e6](https://github.com/ecomfe/okam/commit/c8d16e6))
* **okam-core:** fix triggerEvent none event detail case ([3581107](https://github.com/ecomfe/okam/commit/3581107))

### Features

* **okam-build:** add default babel parser options: {babelrc: false} ([7221830](https://github.com/ecomfe/okam/commit/7221830))
* **okam-build:** add native swan component event handler adapter in okam ([410dbda](https://github.com/ecomfe/okam/commit/410dbda))
* **okam-build:** disable transform click event to tap event for custom component ([60d098a](https://github.com/ecomfe/okam/commit/60d098a))
* **okam-core:** add broadcast support ([9bba7a4](https://github.com/ecomfe/okam/commit/9bba7a4))
* **okam-core:** add native swan component adapter to okam ([d1fa2ea](https://github.com/ecomfe/okam/commit/d1fa2ea))


## 0.3.0-alpha.0 (2018-11-05)

### Bug Fixes

* **okam-build:** fix ant app component page init ([0bba69c](https://github.com/ecomfe/okam/commit/0bba69c))
* **okam-build:** fix ant class template syntax ([b20abf0](https://github.com/ecomfe/okam/commit/b20abf0))
* **okam-build:** fix kebab case ref attribute value ([9302416](https://github.com/ecomfe/okam/commit/9302416))
* **okam-build:** fix not throw error when devSever not enabled in replacement processor ([c6e6176](https://github.com/ecomfe/okam/commit/c6e6176))
* **okam-build:** fix project config not exist case ([5951fe6](https://github.com/ecomfe/okam/commit/5951fe6))
* **okam-build:** fix weixin template event transformation data-* style ([824af2f](https://github.com/ecomfe/okam/commit/824af2f))
* **okam-build:** pad script file content when script exists ([85a8286](https://github.com/ecomfe/okam/commit/85a8286))
* **okam-core:** fix behavior init error in swan ([7e262b0](https://github.com/ecomfe/okam/commit/7e262b0))
* **okam-core:** fix component import path ([0433b4c](https://github.com/ecomfe/okam/commit/0433b4c))
* **okam-core:** fix extend computed prop existed in native and move extend lifecycle to methods for ant ([6e966a9](https://github.com/ecomfe/okam/commit/6e966a9))
* **okam-core:** fix native api cannot promisify ([c3247f8](https://github.com/ecomfe/okam/commit/c3247f8))
* **okam-core:** fix prop type null ([a79fa3a](https://github.com/ecomfe/okam/commit/a79fa3a))
* **okam-core:** fix ref select all not fallback node select all ([36a5d7d](https://github.com/ecomfe/okam/commit/36a5d7d))
* **okam-core:** fix request internal fetch function undefined in ant app ([2c893eb](https://github.com/ecomfe/okam/commit/2c893eb))
* **okam-core:** fix watch not work in wx custom component ([0a7cdd0](https://github.com/ecomfe/okam/commit/0a7cdd0))
* **okam-core:** remove native app component page wrap to fix ant native App/Component/Page undefined ([5dbf1f8](https://github.com/ecomfe/okam/commit/5dbf1f8))


### Features

* **okam-build:** add ant mixin support and internal mixin support ([819e3b6](https://github.com/ecomfe/okam/commit/819e3b6))
* **okam-build:** add ant template transform support ([47eb7de](https://github.com/ecomfe/okam/commit/47eb7de))
* **okam-build:** add global logger ([8a3aaa2](https://github.com/ecomfe/okam/commit/8a3aaa2))
* **okam-build:** add postcss-plugin-wx2swan ([dfd22cc](https://github.com/ecomfe/okam/commit/dfd22cc))
* **okam-build:** support ref multiple instances in template for loop ([52b14ea](https://github.com/ecomfe/okam/commit/52b14ea))
* **okam-core:** add ant mixin support ([c575126](https://github.com/ecomfe/okam/commit/c575126))
* **okam-core:** add na attribute for app/page/component ([172d58b](https://github.com/ecomfe/okam/commit/172d58b))
* **okam-core:** add wx request optimize ([d812b97](https://github.com/ecomfe/okam/commit/d812b97))
* **okam-core:** support ref multiple instances ([80fbdb2](https://github.com/ecomfe/okam/commit/80fbdb2))




