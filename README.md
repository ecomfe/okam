# Okam

[![Build Status](https://travis-ci.org/ecomfe/okam.svg?branch=master)](https://travis-ci.org/ecomfe/okam)
[![Coverage Status](https://coveralls.io/repos/github/ecomfe/okam/badge.svg)](https://coveralls.io/github/ecomfe/okam)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 奥卡姆，一个面向小程序开发的开发框架。

## Intro

在原生小程序基础上，提供类似 `Vue` 开发体验，可以按需增强自己开发框架能力，目前主要支持 `百度小程序` 和 `微信小程序` 开发。

主要功能特性：

* 单文件组件化开发方式

* 更友好的模板语法、数据操作语法

* 支持 `Stylus`、`Less`、`Sass` 预处理样式语言、`Typescript`、`ES Next`

* 支持 NPM 包的依赖管理和引用

* 提供样式单位 rpx 自动转换插件、接口请求 Mock 支持等，以及可配置的构建流程

## Main Packages

| Package | Status | Description |
|---------|--------|-------------|
| [okam-build]          | [![okam-build-status]][okam-build-package] | okam 构建工具 |
| [okam-core]                | [![okam-core-status]][okam-core-package] | okam 核心运行框架 |

[okam-build]: https://github.com/ecomfe/okam/tree/master/packages/okam-build
[okam-build-status]: https://img.shields.io/npm/v/okam-build.svg
[okam-build-package]: https://npmjs.com/package/okam-build

[okam-core]: https://github.com/ecomfe/okam/tree/master/packages/okam-core
[okam-core-status]: https://img.shields.io/npm/v/okam-core.svg
[okam-core-package]: https://npmjs.com/package/okam-core

## Usage

可以参考这里提供的项目模板：[okam-template](https://github.com/ecomfe/okam-template)。

## Documentation

具体参考[这里](https://ecomfe.github.io/okam)。

## Contributions

如果要给该项目贡献代码，可以参考该[文档](./CONTRIBUTING.md)。

## License

[MIT](./LICENSE)
