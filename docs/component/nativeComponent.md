# 原生组件对齐

当开发者需要面临同一套代码兼容不同平台的时候，由于平台间实现差异性，为了达到这样一个理想目标，需要我们去对齐不同平台的组件实现。想更多了解如何撰写特定平台代码可以[参考这里](advance/platformSpecCode)。

> TODO 目前 `okam` 还未提供相应的组件对齐实现，需要开发者自行实现。

## 组件对比
|组件类别 | 微信小程序 | 百度小程序 | 支付宝小程序  | 头条小程序 |  快应用 |
|---|---|---|---|---|---|
|视图容器 | view | view | view | view | div |
| | scroll-view | scroll-view | scroll-view | scroll-view | |
| | swiper | swiper | swiper | swiper | |
| |  | swiper-item | swiper-item | swiper-item | |
| | movable-view | movable-view | movable-view | | |
| | movable-area | movable-area | movable-area | | |
| | cover-view | cover-view | cover-image | | |
| | cover-image | cover-image | | | |
| |  |  |  | | list |
| |  |  |  | | list-item |
| |  |  |  | | popup |
| |  |  |  | | refresh |
| |  |  |  | | stack |
| |  |  |  | | tabs |
| |  |  |  | | tabs-bar |
| |  |  |  | | tabs-content |
|基础内容 | icon | icon | icon | icon | |
| | text | text | text | text | text |
| | rich-text | rich-text |  | rich-text | richtext|
| | progress | progress | progress | progress | progress |
| | | animation-view | | | |
| |  |  |  | | rating |
| |  |  |  | | span |
|表单组件 | button | button | button | button | |
| | checkbox-group | checkbox-group | checkbox-group | checkbox-group||
| | checkbox | checkbox | checkbox | checkbox ||
| | form | form | form | form ||
| | input | input | input | input | input|
| | label | label | label | label | label |
| |  |  |  | | select |
| |  |  |  | | option |
| | picker | picker | picker | picker | picker |
| | picker-view | picker-view | picker-view | picker-view | |
| | picker-view-column | picker-view-column | picker-view-column | picker-view-column| |
| | radio-group | radio-group | radio-group | radio-group | |
| | radio | radio | radio | radio | |
| | slider | slider | slider | slider | slider |
| | switch | switch | switch | switch |switch |
| | textarea | textarea | textarea | textarea |textarea |
|导航 | navigator | navigator | navigator | navigator | a|
|媒体组件 | audio | audio |  | |
| | image | image | image | image | image |
| | video | video |  | video | video |
| | camera | camera |  | | |
| | live-player | live-player |  | | |
| | live-pusher |  |  | | |
|地图 | map | map | map | map | map |
|画布 | canvas | canvas | canvas | canvas | canvas |
|开放能力 | open-data | open-data |  | | |
| | web-view | web-view | web-view | web-view | |
| |  |  |  | | web |
| |  |  | lifestyle | |  |
| |  |  | contact-button | | |
| | ad |  |  | | |
| |official-account |  | | | |

## 组件对齐

### 支付宝小程序

* `canvas` 组件：`canvas` 唯一标识符，微信使用 `canvas-id` 属性，支付宝小程序使用 `id`，开发时候统一使用 `canvas-id`，然后不要使用 `id` 属性，构建时候，会自动将 `canvas-id` 转成 `id` 属性。（`0.4` 版本开始支持）

## 组件兼容

> 0.4 版本开始支持

如果代码需要运行在不同平台，需要对不同平台进行对齐和兼容，目前 `okam` 提供了两个机制：

* 标签转换：[component.template.transformTags](build/transformTag) 配置项
* 组件对齐实现：[特定平台组件实现](advance/platformSpecCode#组件)

## 参考

* [微信小程序组件](https://developers.weixin.qq.com/miniprogram/dev/component/)
* [百度小程序组件](https://smartprogram.baidu.com/docs/develop/component/native/)
* [支付宝小程序组件](https://docs.alipay.com/mini/component/overview)
* [头条小程序组件](https://microapp.bytedance.com/docs/comp/)
* [快应用组件](https://doc.quickapp.cn/tutorial/widgets/list-tutorial.html)
