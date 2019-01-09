# 常见问题

## 遇到问题尝试解决

* 第一步：更新到最新版本，看是否能解决
    * `okam-cli` 升级: `okam upgrade self`
    * 项目升级: `cd 项目路径 && okam upgrade project`
    * 注意看一下 [CHANGELOG](https://github.com/ecomfe/okam/blob/master/CHANGELOG.md), 以免有 breakchange
* 第二步：看一下 [教程文档](https://ecomfe.github.io/okam/#/)，看是否能解决？
* 第三步：搜一下已有 [ISSUE](https://github.com/ecomfe/okam/issues/new)，看是否有帮助？

## 问题集锦

!> 这里记录问题，可能随着各个小程序不断迭代升级优化，有些问题可能已被修复。

### 支付宝小程序

* 目前支付宝开发者工具是默认支持 `ES6` 语法，但部分语法支持有点问题
```javascript
// ./a.js
import * as abc from 'xxx';
export default abc; // 这种写法会导致默认导出没有成功
// export {abc as default}; // 这样也是没法导出成功
// export default Object.assign{{}, abc}; // 这样是 ok 的
// export {abc}; // 不使用默认导出，这样是 ok 的
```

```javascript
// ./b.js
import abc from 'a';
// abc undefined
```

* 如果脚本文件内容是空的，会导致开发者工具报错

* 开发者工具有时候点击左上角返回上一级页面会报：`Cannot read property 'NBPageUrl' of undefined` ：具体原因不详，可以把开发者工具生成的 `.tea` 目录（构建出来项目目录下）删掉，退出开发者工具再进入，自己就会好了。

* 构建配置 `localPolyfill` 引入 `promise` 会导致 `IOS` 下预览出错，目前所有小程序都是默认支持 `Promise`，因此不再需要做 `promise` `polyfill`，解决办法删掉该 `promise` 配置项即可修复，具体原因不详。

## Q&A

* 问题：设置数据或使用某个数据扩展(如: `watch、compute、ref、behavior、redux ...`)等不是生效


    okam 是扩展是可插拔机制的，看一下配置项中是否加上相应扩展项

> [相应扩展](/build/index?id=framework)

* 问题：自定义组件图片路径不显示处理


    百度小程序：自定义组件中的图片路径是相对于引用页面的
    微信小程序：自定义组件中的图片路径是相对于组件本身的

    因此对于此情况，想多平台生效，可以将路径设置为 相对于 小程序项目目录的 绝对路径
    如: `'/common/img/x.png'`, 具体路径，视自己项目情况而定

## 问题求助

* QQ 群 728460911，入群备注：okam
* 提 [ISSUE](https://github.com/ecomfe/okam/issues/new)
