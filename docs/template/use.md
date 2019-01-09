# 模板复用

## import 方式引用

* `import` 你要引用的模板，语法同原生小程序，建议引用的模板文件名后缀为 `tpl`，这样引用的模板文件里默认可以使用开发框架定义的[模板的语法](template/syntax)

* 使用 `tpl` 标签引用模板，`tpl` 标签属性定义同原生小程序，为了避免跟外层 `template` 混淆，所以这里使用 `tpl` 简写形式引用模板

```src/common/tpl/footer.tpl
<!-- page footer -->
<template name="page-footer">
    <view class="page-footer">
        footer: {{copyRightDate}}
    </view>
</template>
```

```src/pages/home/index.okm
<template>
    <view class="tpl-reuse-wrap">
        <import src="../../common/tpl/footer.tpl"/>
        <view class="main"></view>
        <tpl is="page-footer" :data="{copyRightDate: copyRightDate}" />
    </view>
</template>

<script>
const now = new Date();
export default {
    config: {
        title: '模板复用'
    },
    data: {
        copyRightDate: now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
    }
};
</script>

<style lang="stylus">
</style>
```

**注意：** 通过 `data` 属性传入模板数据。

## include 方式引用

* 按原生小程序 `include` 语法引入要引用的模板文件
* 引用的模板会被内联过来，因此引入的模板上下文可以访问的模板数据同父模板，不需要传入

```src/common/tpl/include.tpl
<view>Hello: {{from}}</view>
```

```src/pages/home/index.okm
<template>
    <view class="tpl-reuse-wrap">
        <include src="../../common/tpl/include.tpl"/>
    </view>
</template>

<script>
const now = new Date();
export default {
    config: {
        title: '模板复用'
    },
    data: {
        from: 'okam'
    }
};
</script>

<style lang="stylus">
</style>
```
