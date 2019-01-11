# v- 指令支持

`okam` 从 `0.4.6` 版本开始支持 `v-` 指令语法，默认不开启。

**支持方式**: 需手动将构建配置项 `component.template.useVuePrefix` 设置为: `true`, 默认为 `false` 不开启。

## 动态属性
支持 `v-bind` 及缩写 `:`

```
<view :data-a="{a: 1, b: 2}">普通对象</view>
<view v-bind:data-a="{foo, bar}">key和value相同的对象</view>
<view v-bind:data-b="{...object, e: 5}">带扩展运算符的对象</view>
<view class="static" :class="[isActive ? activeClass : '', errorClass]">hello world</view>
```

## 条件判断

支持使用 `if`、`elif`、`else-if`、`else` 来决定模板模块的展现。此处与 `vue` 不同，`elif`, `else-if` 两者都支持,
但为了便于代码的统一性和可维护性，在使用时请使用一种写法，以下仅为示例

```html
<view if="a">A</view>
<view elif="b">B</view>
<view else-if="c">C</view>
<view else>D</view>
```

## 列表渲染

支持 `v-for`, 支持使用 `of` 替代 `in` 作为分隔符

```
<div v-for="item in 5">
    遍历数字5: {{item}}
</div>
<div class="hello" v-for="(item, index) of ['of', 2]">
    for of 遍历数组{{item}}
</div>
<view v-for="item of {a:1,b:2}">of遍历字面量对象: hello {{index}} {{item}}</view>
<view v-for="item of {a,b}">of遍历字面量对象2: hello {{index}} {{item}}</view>
<view v-for="item of {a2: a, b2: b}">of遍历字面量对象3: hello {{index}} {{item}}</view>
```

## 事件处理

支持 `v-on` 及缩写 `@`

```
<button v-on:click="handleClick($event)">click me with bracket one $event</button>
<button v-on:click="handleNoArgs()">click me with bracket no arguments</button>
<button @click.prevent="handleNoArgs">click me with no arguments</button>
```

## 注意项
!>  1.暂不支持 `v-text、v-html、v-show、v-pre、v-cloak、v-once`;<br>
    2.`v-model` 需要配置才支持[配置详见](template/v-model.md);<br>
    3.`okam` 不支持的指令，`v-` 也不支持，`v-` 只在 `okam` 框架语法基础上 增加了 `v-` 前缀写法;
