#  事件处理

## 事件绑定

`okam`的事件绑定使用`@`前缀声明

如果想对一个标签绑定一个事件，可以通过如下方式：
```html
<view @click="handleClick">按钮</view>
```

最常见的`click`事件，会被映射为百度智能小程序中的`bindtap`。其他事件映射关系没有变化。**注意：** 从 `0.3.0` 开始，此映射只针对原生组件，对于自定义组件不会自动映射到 `tap` 事件。

## 修饰符

`okam`支持 `.stop` `.capture` `.self`三种事件修饰符，可组合使用：
- `.stop` 阻止冒泡。即阻止从触发事件的本身继续向父级元素逐层触发（对应原生小程序的`catch`）
- `.capture` 事件捕获模式。即先触发元素自身的事件，然后由父元素继续向（捕获模式的）子级元素逐层触发事件（对应原生小程序的`capture-bind`）
- `.capture.stop` 使用事件捕获模式，且阻止冒泡（对应原生小程序的`capture-catch`）
- `.self` 只有当触发的元素是自身时，绑定的事件处理函数才会被执行（即`event.target`同`event.currentTarget`时）

!> 在微信小程序中， 由于事件对象的`target` 和 `currentTarget`没有默认id，因此微信小程序不支持`self`修饰符

```html
<!-- 阻止点击事件继续传播 -->
<view @click.stop="handleThis"></view>

<!-- 添加事件监听器时使用事件捕获模式：即元素自身触发的事件先在此处理，然后才交由内部元素进行处理 -->
<view @click.capture="handleThis">...</view>

<!-- 修饰符可以串联 -->
<view @click.stop.capture="handleThis"></view>

<!-- 事件不是从内部元素触发的-->
<view @click.self="handleThis">...</view>
```

> 事件捕获发生在事件冒泡之前。一次事件周期中，总是先触发所有的捕获事件，然后再触发冒泡事件。以下是一个比较完整的例子，如果点击g元素的话，事件触发顺序是什么呢？（在继续看下文前可先自行判断下）

```
<view class="a" @click="handleBubble('a')">
    a
    <view class="b" @click.stop="handleBubble('b')">
        b with stop
        <view class="c" @click.self="handleBubble('c')">
            c with self
            <view class="d" @click.capture="handleBubble('d')">
                d with capture
                <view class="e" @click.capture="handleBubble('e')">
                    e with capture
                    <view class="f" @click="handleBubble('f')">
                        f
                        <view class="g" @click="handleBubble('g')">
                            g: click me!
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</view>
```
如果上述这个例子没有任何修饰符的话，触发顺序会是g -> f -> e -> d -> c -> b -> a；<br>
但是由于**一次事件周期中，总是先触发所有的捕获事件，然后再触发冒泡事件。**, 所以捕获事件`d`和`e`会先被触发；<br>
而且**捕获模式的触发顺序是由父级向子级逐层传递**，因此触发的顺序是 `d -> e`；  <br>
而且**冒泡模式的触发顺序是由子级向父级逐层传递**，因此接下来的触发顺序是`g -> f`；<br>
而且**修饰符self只有当触发元素是自身时，事件处理函数才会执行**，因此接下来的`c`不会被触发；<br>
依据**冒泡的触发顺序（由子级向父级）**，接下来，触发的元素是`b`；<br>
但是b元素上绑定了**stop修饰符，阻止事件继续向上冒泡**，因此接下来的`a`不会被触发；<br>
综上：事件的触发顺序是：`d -> e -> g -> f -> b`（在微信小程序中，事件的触发顺序是：`d -> e -> g -> f -> c -> b`）

> 另外，并不是所有的事件都支持冒泡和捕获，支持的事件列表如下：

| 事件类型 | 触发时机 |
| --- | --- |
| click  | 触摸后马上离开 |
| longtap | 触摸后超过350ms再离开（推荐使用 longpress 事件代替） |
| longpress | 触摸后超过350ms再离开，如果是指定了事件回调函数并触发了这个事件，tap 事件将不被触发 |
| touchstart | 触摸开始时 |
| touchmove | 触摸后移动时 |
| touchcancel | 触摸后被打断时，如来电等 |
| touchend | 触摸结束时 |
| touchforcechange | 支持 3D Touch 的 iPhone 设备，重按时会触发。 |

!> 注意，原生组件video、live-player、canvas、cover-view、cover-image等在基础库`1.12.0`版本之后，才支持事件冒泡和事件捕获。<br><br>
在`Vue`中还支持其他3种修饰符，目前`okam`尚不支持：<br>
 -`prevent` 百度智能小程序目前没有事件的默认行为，所以也就不存在阻止默认行为。（`submit`、跳转等）。<br>
 -`passive` 百度智能小程序事件中，没有相关功能。<br>
 -`once` 百度智能小程序尚不支持移除模板中的事件功能，如果通过转换之后在运行时实现不够优雅，未来可能会支持。<br>

## 事件命名风格

 由于`支付宝`小程序，事件命名风格跟微信、百度小程序风格不一致，为了保证命名风格统一，要求原生事件名全小写，自定义组件避免触发跟原生事件同名的事件（忽略大小写情况下），下面列出来的是目前针对支付宝小程序会转换的原生事件，会自动将原生事件的命名风格转成支付宝的驼峰形式的命名风格：

|声明的事件|转换后的事件名|
|---|---|
|tap|tap|
|touchstart|touchStart|
|touchmove|touchMove|
|touchend|touchEnd|
|touchcancel|touchCancel|
|longtap|longTap|

OKAM 开发模板语法：
```
<view @touchstart="handleTouchStart"></view>
```

转换成支付宝小程序的模板语法：
```
<view onTouchStart="__handlerProxy" data-touch-start-event-proxy="handleTouchStart"></view>
```

## 参数传递

**在事件被触发的时候，写在模板中的参数，会按照绑定的顺序传入事件处理函数中。**

参数支持传递：`字符串`、`变量`、`数组`、`对象`、`括号表达式（仅支持简单运算及三元运算符）`、`$event`（即原生事件的 `event` 对象）

* 默认事件对象

    如果绑定事件时，未传递任何参数（有括号和没有括号），可以直接在事件处理函数中，通过event拿到默认的事件对象。

    ```html
    <view @click="handleClick()">Hello World</view>
    <view @click="handleClick">Hello World</view>
    ```
    ```javascript
    // 在事件处理函数中，可以通过event拿到默认的事件对象
     handleClick(event) {
         console.log(event);
     }
    ```

* 变量、常量参数

    目前支持字面量参数，也支持变量传入，例如在`data`中有一个变量叫`hello`，那么可以在模板中直接绑定：

    ```html
    <view>
        <!-- 支持变量 -->
        <view @click="handleClick(hello)">Hello World</view>
    </view>

    <view>
        <!-- 支持变量+字面量 -->
        <view @click="handleClick(hello, 'hello', 123, true)">Hello World</view>
    </view>
    ```

    也支持传入`for`循环时的索引及变量：
    ```html
    <view for="item in [1,2,3]" @click="handleFor(item)">click me</view>
    ```

    **请注意，变量取值是在事件触发的时候传入，而不是在事件绑定的时候。**



* `$event` 事件参数

    那么如何在事件触发的时候，获取到事件本身呢？目前支持通过使用`$event`方式，来直接拿到[百度智能小程序事件对象](!https://smartprogram.baidu.com/docs/develop/framework/view_incident/#%E4%BA%8B%E4%BB%B6%E5%AF%B9%E8%B1%A1)。
    `$event`可以位于参数列表的任意位置。

    ```html
    <view @click="handleClick(hello, $event, 'hello', 123, true)">Hello World</view>
    ```

* 事件参数支持三元表达式

    ```html
    <view>
        <!-- 三元表达式，运行时判断 -->
        <view @click="handleClick(hello ? 'hello' : 'world', $event)">Hello World</view>
    </view>
    ```

## 事件参数绑定原理

百度智能小程序不支持在事件触发的回调函数中携带任何参数，`okam`是通过定义一个全局的`__handlerProxy`方法，代理了真实事件，通过它把事件的参数联系起来。

