# 列表渲染

## 遍历数组
* 原生支持的语法，默认下标索引是为 `index`，默认数组当前变量名默认为 `item`。
```html
<view><view for="list">{{item}}： {{index}}</view></view>
```

* 支持指定索引和当前项名称，`for="p,index in persons"` 或 `for="(p,index) in persons" `均可
```html
<view><view for="(item, index) in list"></view></view>
<view><view for="item, index in list"></view></view>
```


* 支持以数字作为取值范围
```html
<!--  遍历出的结果是 1 2 3 4 5-->
<view for="item in 5">{{item}}</view>
```

* 支持使用`of`替代`in`作为分隔符
```html
<view for="item of list">{{item}}</view>
<!--  相当于 -->
<view for="item in list">{{item}}</view>
```

## 遍历对象
* 仅指定对象的属性值
```html
<view for="value in obj"></view>
```
* 指定对象的 `key` 和 `value`
```html
<view for="value,key in obj"></view>
```

* 支持使用`of`替代`in`作为分隔符
```html
<view for="item of obj">{{item}}</view>
<!--  相当于 -->
<view for="item in obj">{{item}}</view>
```

## 在 block 上使用 for
`block` 是虚拟标签，可以用 `for` 来循环渲染一组组件或者标签。
```html
<block for="item, index in list"> <span>A</span> <span>B</span> </block>
```

## for 和 if 共存
支持在同一个标签中使用`for`和`if`，在`if`的属性值中可以获取`for`的索引或当前项变量。如下：
```html
  <view for="item,index in [false,true,false]" if="item">hello:{item}</view>
```
可以发现，for 和 if 共存时，for 的优先级高于 if。但如果你的目的就是根据if条件，决定是否循环，你应该如下编码
```html
<view if="list.length">
  <view for="item,index in list">hello:{item}</view>
</view>
```

## for 和 else/elif/else-if共存
区别于上述的 `for` 和 `if` 共存。 `for`和 `else/elif/else-if`共存时，`else/elif/else-if`的优先级高于 `for`。
原因是，`else/elif/else-if`必须紧跟在 `if/else-if/elif` 分支后，在`for` 循环中重复 `else` 无意义且会导致解析错误。在`for` 循环中重复 `elif/else-if` 容易导致错误或者难以理解。以下是正确的使用方式
```html
<view if="conditionA">hello A!</view>
<view elif="conditionB" for="item,index in listA">hello B! {{item}}</view>
<view else for="item,index in listB">hello B! {{item}}</view>
```

!> `for` 和 `if` 和 `else` 三者并存时，请不要 使用 `for if` 并存写法，因为 `for if` 并存 `for` 优先级高， 这种情况下会报错，请使用 `block` 标签自行包裹一层

## 嵌套的 for

允许嵌套使用，索引名和当前项变量名可以相同（但是从质量和可读性角度不建议这样命名）

```html
<!-- good -->
<view for="(menu, index) in list">
    <view for="(item, itemIndex) in menu">
        {{itemIndex}} : {{item}}
    </view>
</view>

<!-- bad -->
<view for="(item, index) in list">
    <view for="(item, index) in item">
        {{index}} : {{item}}
    </view>
</view>
```

## :key（微信小程序支持）
对于微信小程序中的`for`，需要使用 `:key` 来指定列表中项目的唯一的标识符。如未给出，`okam` 会在编译过程中给出警告。
为符合vue语法使用习惯，`:key`的值可为 `item` 或者 `item.itemAttr`。用法如下，`okam` 会在编译过程中将其转化为微信小程序识别的语法`*this`、`itemAttr`。

```
<view for="(item, index) in list" :key="item"></view>
<view for="(item, index) in list" :key="item.id"></view>
```

关于数组数据操作，参考[数组操作语法](component/setData)。
