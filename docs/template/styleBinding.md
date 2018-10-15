# 样式绑定
提供 `class` 绑定及 `style` 绑定支持。

## class 绑定

* 对象语法

    * 支持对象语法，即给`:class`传一个对象，以动态切换class。如下，根据数据取值情况生成动态的 class 值
    ```html
    <view :class="{ active: isActive，'text-danger': hasError}">hello world</view>

    <!--  data: {isActive: true, hasError: false} 时，class值为： -->
    <view class="active"></view>
    <!-- data: {isActive: true, hasError: true} 时， class值为： -->
    <view class="active text-danger"></view>
    ```

    * 支持与普通 class 共存。如下，静态 class 和动态的 class 最后会合并一起
    ```html
    <view class="static" :class="{ active: isActive, 'text-danger': hasError }">hello world</view>

    <!-- data: {isActive: true, hasError: false} 时， class值为：-->
    <view class="static active"></view>
    ```

* 数组语法

    * 支持数组语法，即给`:class`传一个数组，以应用一个 class 集合。
    ```html
    <view class="static" :class="[activeClass, errorClass]">hello world</view>

    <!-- data: { activeClass: 'active', errorClass: 'text-danger'} 时， class值为：-->
    <view class="active text-danger"></view>
    ```

    * 对于数组中的具体元素，可以用三元表达式以切换条件。
    ```html
    <view class="static" :class="[isActive ? activeClass : '', errorClass]">hello world</view>
    ```

    * 在数组语法中也可以使用对象语法。
    ```html
    <view class="static" :class="[{ active: isActive }, errorClass]">hello world</view>
    ```

!> 暂不支持直接绑定对象变量（因为模板转化是静态编译，非运行时），如果是对应的 class 值是字符串变量则是允许的。如下，如果 `classObject` 是一个对象，将不能正确的识别。

```html
<!-- {data: {classObject: {active: true, 'entry-btn': true}}} 这个是不支持的 -->
<view :class="classObject"></view>

<!-- {data: {classStr: 'active entry-btn'} 这个是支持的 -->
<view :class="classStr"></view>
```

## style 绑定

* 对象语法

支持在`:style`上绑定对象语法。如下，注意属性可以是 `驼峰` 或者是用单引号包起来的 `短横线分隔词`
```html
<view :style="{ color: colorStyle, fontSize: fontStyle + 'px', 'font-weight':'bold' }">对象语法</view>

<!-- data: { colorStyle: 'red', fontStyle: 20} 时， style值为：-->
<view style="color:'red';font-size:20px;font-weight:'bold"></view>
```

* 数组语法

支持在`:style`上绑定数组语法。如下，数组的元素可以是上述对象语法中的对象形式
```html
<view :style="[{ color: colorStyle, fontSize: fontStyle + 'px' }, {fontWeight:'bold'}]">数组语法</view>
```

!> 暂不支持直接绑定对象变量（因为模板转化是静态编译，非运行时），如果是对应的 style 值是字符串变量是支持的。如下，如果 `styleObject` 是一个对象，将不能正确的识别。

```html
<!-- {data: {styleObject: {fontSize: '20px'}} 这个是不支持的 -->
<view :style="styleObject"></view>

<!-- {data: {styleStr: 'font-size: "20px"'} 这个是支持的 -->
<view :style="styleStr"></view>
```
