# 条件渲染

## if-elif-else
* 使用 `if`、`elif`、`else` 来决定模板模块的展现。
```html
<view if="a">A</view>
<view elif="b">B</view>
<view else>C</view>
```

* 支持用`else-if`替代`elif`
```html
<view if="a">A</view>
<view else-if="b">B</view>
<view else>C</view>
```

## 在 block 上使用 if
`block` 是虚拟标签，可以用 `if` 来渲染一组组件或者标签。
```html
<block if="yes"> <text>A</text> <text>B</text> </block>
```

!> 原生限制，没有 `show` 语法 <br>
