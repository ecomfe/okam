<template>
    <article class="home-wrap">
        <h1 class="page-title"> v- 前缀 支持</h1>
        <section>
            <h3 class="section-title">说明</h3>
            <h3 class="content-title">在 okam 框架基础上，支持 v- 前缀</h3>
            <h3 class="content-title">Tips： vue 语法并不全部支持</h3>
            <ul class="tips-container">
                <li class="tip-item" v-html="xxx">不支持 v-html</li>
                <li class="tip-item" v-show="false">不支持 v-show</li>
                <li class="tip-item">不支持过滤器</li>
                <li class="tip-item">不支持函数</li>
            </ul>
        </section>

        <section>
            <h3 class="content-title">动态属性</h3>
            <span class="text">支持 v-bind:key :key</span>
            <pre class="code">
                <code for="item in dynamicAttr" :key="item">{{item}}</code>
            </pre>
            <div class="example">
                <div :id="'item-' + myID">动态绑定id</div>
                <div v-bind:class="myClass">动态绑定class</div>
            </div>
        </section>

        <section>
            <h2 class="section-title">条件判断</h2>
            <span class="text">支持 v-if 、v-elif、v-else-if、v-else， v-show 将被转成 v-if </span>
            <pre class="code">
                <code for="item in condition" :key="item">{{item}}</code>
            </pre>
            <div class="example">
                <div v-if="2<1"> 2 &lt; 1  </div>
                <div v-if="2<1"> 2  </div>
                <div v-elif="1===3">1===3</div>
                <div v-else-if="2===3">2===3</div>
                <div v-else>3</div>
            </div>
        </section>

        <section>
            <h2 class="section-title">列表渲染</h2>
            <span class="text">支持两种写法：v-for="p,index in persons" 或 v-for="(p, index) in persons"</span>
            <pre class="code">
                <code for="item in forList">{{item}}</code>
            </pre>
            <div class="example">
                <div v-for="item in 5">
                    遍历数字5: {{item}}
                </div>
                <div class="hello" v-for="(item, index) of ['of', 2]">
                    for of 遍历数组{{item}}
                </div>
                <view v-for="item of {a:1,b:2}">of遍历字面量对象: hello {{index}} {{item}}</view>
                <view v-for="item of {a,b}">of遍历字面量对象2: hello {{index}} {{item}}</view>
                <view v-for="item of {a2: a, b2: b}">of遍历字面量对象3: hello {{index}} {{item}}</view>
            </div>
        </section>

        <section>
            <h2 class="section-title">事件处理</h2>
            <span class="text">支持 v-on: @ 修饰符，框架不支持的 修饰符，此处也不支持，这里只是兼容 vue 语法 的写法，需自行规避</span>
            <pre class="code">
                <code for="item in eventList">{{item}}</code>
            </pre>
            <div class="example">
                <button
                    @click.capture.once="handleClick(a ? 1 : 0, 'a & b', $event, [name,2,3],true, '$event', $event,name, {a:1,b:2})">
                    click me with arguments
                </button>
                <button v-on:click="handleClick($event)">click me with bracket one $event</button>
                <button v-on:click="handleNoArgs()">click me with bracket no arguments</button>
                <button @click.prevent="handleNoArgs">click me with no arguments</button>
            </div>
        </section>
    </article>
</template>
<script>
import moment from 'moment';

export default {
    config: {
        navigationBarTitleText: 'Hello Okam Smart Program',
        backgroundColor: '#fff'
    },

    data: {
        a: 'test-a',
        b: 'test-b',
        title: '支持 vue 模板语法',
        myID: '#myId',
        name: 'okam',
        dynamicAttr: [
            '<span :id="\'item-\' + myID">动态绑定id</span>',
            '<span v-bind:class="myClass">动态绑定class</span>'
        ],
        condition: [
            '<div v-if="2<1"> 2 &lt; 1  </div>',
            '<div v-if="2<1"> 2  </div>',
            '<div v-elif="1===3">1===3</div>',
            '<div v-else-if="2===3">2===3</div>',
            '<div v-else>3</div>'
        ],
        forList: [
            '<div v-for="item in 5" :key="item">',
            '    遍历数字5: {{item}}',
            '</div>',
            '<div class="hello" v-for="(item, index) of [\'of\', 2]" :key="item">',
            '    for of 遍历数组{{item}}',
            '</div>',
           ' <view v-for="item of {a:1,b:2}" :key="item">of遍历字面量对象: hello {{index}} {{item}}</view>',
           ' <view v-for="item of {a,b}" :key="item">of遍历字面量对象2: hello {{index}} {{item}}</view>',
            '<view v-for="item of {a2: a, b2: b}" :key="item">of遍历字面量对象3: hello {{index}} {{item}}</view>'
        ],
        eventList: [
            '<button',
            '    @click.capture.once="handleClick(a ? 1 : 0, \'a & b\', $event, [name,2,3],true, \'$event\', $event,name, {a:1,b:2})">',
            '    click me with arguments',
            '</button>',
            '<button v-on:click="handleClick($event)">click me with bracket one $event</button>',
            '<button v-on:click="handleNoArgs()">click me with bracket no arguments</button>',
            '<button @click.prevent="handleNoArgs">click me with no arguments</button>'
        ]
    },

    methods: {
        handleClick(...args) {
            console.log('click happen', args);
            this.$api.showToast({
                title: '参数:' + args,
                duration: 3000
            });
        },
        handleNoArgs(event) {
            console.log(event);
            console.log('handleNoArgs');
        }
    }
};
</script>
<style lang="stylus">
.home-wrap
    background: #fff
    padding: 10px 20px
    font-size: 12px

    .page-title
        text-align center
        font-size 28px
        font-weight bold
        padding 8px 0

    .section-title
        margin: 15px 0 10px
        font-size: 24px
        color: #145996
        border-bottom 1px solid #145996

    .content-title
        font-size: 18px
        margin: 10px 0 5px


    .example,
    .code
        position: relative
        padding: 5px
        background #f8f8f8
        border: 1px solid #d3d3d3
        border-radius 5px
        &:after
            position: absolute
            top: 0
            right: 0
            padding: 5px
            background: #f0f0f0
            color: #666

    .example
        background: #fff
        margin-top: 10px

        &:after
            content: 'example'

    .code
        &:after
            content: 'code'

    .tips-container
        background #f8f8f8
        padding 5px 10px
        border-left 2px solid #ff812a

        .tip-item
            font-size: 14px
    button
        border: 1px solid #eee
        font-size: 12px

    .text
        font-size: 12px
</style>
