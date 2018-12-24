# 常见问题

## 遇到问题尝试解决

* 第一步：更新到最新版本，看是否能解决
    * `okam-cli` 升级: `okam upgrade self`
    * 项目升级: `cd 项目路径 && okam upgrade project`
    * 注意看一下 [CHANGELOG](https://github.com/ecomfe/okam/blob/master/CHANGELOG.md), 以免有 breakchange
* 第二步：看一下 [教程文档](https://ecomfe.github.io/okam/#/)，看是否能解决？
* 第三步：搜一下已有 [ISSUE](https://github.com/ecomfe/okam/issues/new)，看是否有帮助？

## 问题列表

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
