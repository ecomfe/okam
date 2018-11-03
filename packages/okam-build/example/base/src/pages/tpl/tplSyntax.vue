<template>
    <article class="home-wrap">
        <h1 class="page-title">{{title}}</h1>

        <section :hello="hello" style="display: none">
            <h2 class="demo-title">我是透明的demo</h2>

            <form action="">
                <button form-type="123" :class="a"></button>
            </form>

            <h2>动态属性</h2>
            <span :id="'item-' + myID">动态绑定id</span>
            <span :class="myClass">动态绑定class</span>
            <checkbox :checked="false">关键字</checkbox>

            <h2>class 绑定</h2>
            <span :class="{ active: isActive }">hello world</span>
            <span class="static" :class="{ active: isActive, 'text-danger': hasError }">hello world</span>
            <span class="static" :class="[activeClass, errorClass]">hello world</span>
            <span class="static" :class="[isActive ? activeClass : '', errorClass]">hello world</span>
            <span class="static" :class="[{ active: isActive }, errorClass]">hello world</span>

            <h2>style 绑定</h2>
            <span :style="{ color: colorStyle, fontSize: fontStyle + 'px' }">对象语法</span>
            <span :style="[{ color: colorStyle, fontSize: fontStyle + 'px' }, {fontWeight:'bold'}]">数组语法</span>
            <span for="item in 3" :style="{fontSize: fontSize[item], fontFamily:'Times New Roman'}">测试循环遍历</span>
            <span :style="styleString">普通字符串</span>

            <h2>布尔属性</h2>
            <view if="true" hi="{{true}}">hello im true</view>
            <view else></view>
            <button @click="handleButton" plain>plain=hello</button>

            <h2>JS表达式</h2>
            <span if="length > 5">逻辑判断</span>
            <span>数据路径计算: {{object.key}} {{list[0][0]}}</span>
            <span :data-a="{a: 1, b: 2}"> 对象 </span>
            <span :data-b="{...object, e: 5}" @click="handleButton">扩展运算符</span>
            <span :data-c="{foo, bar}" @click="handleButton">key、value相同</span>

            <h2>条件渲染</h2>
            <div if="2<1"> 2 &lt; 1  </div>
            <div if="2<1"> 2  </div>
            <div elif="1===3">1===3</div>
            <div else>3</div>

            <h2>事件修饰符</h2>
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

            <view>for循环</view>
            <view class="hello" for="(item,index) of  ['of',2]  " :key="item">
                for of 遍历数组：{{item}}
            </view>

            <view for="item in 5" :key="item">
                遍历数字5 {{item}}
            </view>

            <view for="item,index in [false,true,false]" if="item" hello="hello" :key="item">
                <span>for 和 if 共存：</span>
                <span>i'm from</span>
                for and if when {{item}}
            </view>

            <block for="item,index in [false,true,false]" :key="item" if="item" hello="hello">
                <span>block 为父元素，for 和 if 共存：</span>
                <span>i'm from</span>
                for and if when {{item}}
            </block>

            <view for="item of {a:1,b:2}" :key="item">of遍历字面量对象: hello {{index}} {{item}}</view>
            <view for="item of {a,b}" :key="item">of遍历字面量对象2: hello {{index}} {{item}}</view>
            <view for="item of {a2: a, b2: b}" :key="item">of遍历字面量对象3: hello {{index}} {{item}}</view>

            <button class="button" for="item in [1,2,3]" :key="item"
                    @click="handleFor(item)">在for循环中点击：click me</button>

            <view for="item, index in list" :key="item">
                <view for="item, index in item" :key="item">
                    {{item}}:{{index}}
                </view>
            </view>

            <view for="item in keyArray" :key="item.unique">
                {{item.id}}:{{item.unique}}
            </view>

            <view for="item in persons" :key="item">
                {{item}}
            </view>

        </section>

        <section>
            <h2 class="section-title">数据绑定</h2>

            <h3 class="content-title">普通文本</h3>
            <pre class="code">{{normalText}}</pre>

            <h3 class="content-title">动态属性</h3>
            <pre class="code">
                <code for="item in dynamicAttr" :key="item">{{item}}</code>
            </pre>

            <h3 class="content-title">class与style绑定</h3>
            <span class="text">class的绑定支持对象语法（传一个对象，以动态切换class）和数组语法（传一个数组给以应用一个class列表），不支持classObject</span>
            <pre class="code">
                <code for="item in classBinding" :key="item">{{item}}</code>
            </pre>
            <span class="text">style的绑定支持对象语法和数组语法，不支持styleObject</span>
            <pre class="code">
                <code for="item in styleBinding" :key="item">{{item}}</code>
            </pre>

            <h3 class="content-title">JS表达式</h3>
            <pre class="code">
                <code for="item in jsExpression" :key="item">{{item}}</code>
            </pre>

            <h3 class="content-title">Tips</h3>
            <ul class="tips-container">
                <li class="tip-item">不支持原始HTML</li>
                <li class="tip-item">不支持过滤器</li>
                <li class="tip-item">不支持函数</li>
            </ul>
        </section>

        <section>
            <h2 class="section-title">条件渲染</h2>
            <pre class="code">
                <code for="item in condition" :key="item">{{item}}</code>
            </pre>
        </section>

        <section>
            <h2 class="section-title">列表渲染</h2>
            <span class="text">支持两种写法：for="p,index in persons"或for="(p,index) in persons"</span>
            <pre class="code">
                <code for="item in forList" :key="item">{{item}}</code>
            </pre>
        </section>

        <section>
            <h2 class="section-title">事件处理</h2>
            <span class="text">参数可传：字符串、变量、数组、对象、括号表达式（仅支持简单运算及三元运算符）、$event（即原事件对象）</span>
            <pre class="code">
                <code for="item in eventList" :key="item">{{item}}</code>
            </pre>
            <button
                @click.capture.once="handleClick  (a ? 1 : 0, 'a & b',$event, [name,2,3],true, '$event', $event,name, {a:1,b:2})">
                click me with arguments
            </button>
            <button @click="handleClick($event)">click me with bracket one $event</button>
            <button @click="handleNoArgs()">click me with bracket no arguments</button>
            <button @click.prevent="handleNoArgs">click me with no arguments</button>
            <a href="/subPackages/pages/subPageA/index">go sub page A</a>
        </section>

        <a class="backButton" href="/pages/home/index"></a>
    </article>
</template>
<script>
import moment from 'moment';

export default {
    config: { // The page config defined in page.json
        navigationBarTitleText: 'Hello Okam Smart Program',
        backgroundColor: '#fff'
    },

    data: {
        a: 'test-a',
        b: 'test-b',
        keyArray:[{id: 5, unique: 'unique_5'},
            {id: 4, unique: 'unique_4'},
            {id: 3, unique: 'unique_3'},
            {id: 2, unique: 'unique_2'},
            {id: 1, unique: 'unique_1'},
            {id: 0, unique: 'unique_0'}],
        object:{a:'a',b:'b'},
        list:[['a','b'],['1','2']],
        isActive: true,
        hasError: true,
        foo:1,
        bar:2,
        activeClass: 'active',
        errorClass: 'error',
        fontStyle: 30,
        colorStyle: '#f00',
        styleString: 'font-size:10px',
        fontSize: ['', '20px', '15px', '12px'],
        title: '小程序模板语法',
        myID: '#myId',
        name: 'okam',
        normalText: "<span>{{text}}</span>",
        dynamicAttr: [
            "<span :id=\"'item-' + myID\">动态绑定id</span>",
            "<span :class=\"myClass\">动态绑定class</span>",
            "<checkbox :checked=\"false\">关键字</checkbox>"
        ],
        jsExpression: [
            "<span if=\"length > 5\">逻辑判断</span>",
            "<span>数据路径计算: {{object.key}} {{array[0]}}</span>",
            "<span :data=\"{for: a, bar: b}\">对象</span>",
            "<span :data=\"{...obj1, ...obj2, e: 5}\">扩展运算符</span>",
            "<span :data=\"{foo, bar}\">key、value相同</span>"
        ],
        condition: [
            "<div if=\"a\" s-if=\"hehe\">1</div>",
            "<div elif=\"b\">2</div>",
            "<div else>3</div>"
        ],
        forList: [
            "<ul><li for=\"p,index in persons\">{{index}}: {{p}}</li></ul>",
            "<ul><li for=\"(p,index) in persons\">{{index}}: {{p}}</li></ul>"
        ],
        eventList: [
            '<button @click.capture.once="handleClick  ((a ? 1 : 0), \'a & b\',$event, \'$event\', $event,name, {a:1,b:2})">click me with arguments</button>',
            '<button @click="handleNoArgs">click me with no arguments</button>'
        ],
        classBinding: [
            '<span :class="{ active: isActive }">hello world</span>',
            '<span class="static" :class="{ active: isActive, \'text-danger\': hasError }">hello world</span>',
            '<span class="static" :class="[activeClass, errorClass]">hello world</span>',
            '<span class="static" :class="[isActive ? activeClass : \'\', errorClass]">hello world</span>',
            '<span class="static" :class="[{ active: isActive }, errorClass]">hello world</span>'
        ],
        styleBinding: [
            '<span :style="{ color: colorStyle, fontSize: fontStyle + \'px\' }">对象语法</span>',
            '<span :style="[{ color: colorStyle, fontSize: fontStyle + \'px\' }, {fontWeight:\'bold\'}]">数组语法</span>',
            '<span :style="styleString">普通字符串</span>'
        ],
        myClass: new Date().getTime() % 2 === 0 ? 'pink-style' : 'cyan-style',
        persons: ['xiaoming', 'xiaohong', 'xiaowang']
    },

    methods: {
        handleClick(...args) {
            console.log('click happen', args);
            this.$api.showToast({
                title: '参数:' + args,
                duration: 3000
            });
        },

        handleButton(event) {
            console.log(event)
            console.log('click button');
        },

        handleParent(event) {
            console.log('click parent');
        },

        handleHi(...args) {
            console.log('hi happen', args);
        },

        handleNoArgs(event) {
            console.log(event);
            console.log('handleNoArgs');
        },
        handleFor(item) {
            console.log(item);
        },
        handleBubble(arg) {
            this.$api.showToast({title:arg})
            console.log('clicked: ' + arg);
        }
    }
};
</script>
<style lang="stylus">
.home-wrap
    font-size: 14px;
    height: 100%
    min-height: 100%
    background-color: #ffffff
    color: #333333
    padding: 10px 20px
    .demo-title
        text-align center
        font-weight bold
    .a, .b, .c, .d, .e, .f, .g
        border: 1px solid blue
        padding: 10px
    .active
        border: 1px solid cyan
        display inline
    .error
        color: red
    .text-danger
        font-weight: bold
        font-size: 20px
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
    .code
        font-size: 12px
        padding: 5px
        background #f8f8f8
        border: 1px solid #d3d3d3
        border-radius 5px
    .backButton
        position fixed
        bottom: 20px
        right 10px
        border: 1px solid #333333
        border-radius: 50%
        height: 40px
        width: 40px
        background: no-repeat center 40% / 80% url('../../common/img/ui.png') rgba(0, 0, 0, 0.2)
    .tips-container
        background #f8f8f8
        padding 5px 10px
        border-left 2px solid deeppink
        .tip-item
            font-size: 14px
    button
        border: 1px solid #eeeeee
        font-size: 12px
    .pink-style
        color: pink
    .cyan-style
        color: cyan
    .text
        font-size: 12px
    .main
        margin-top: 20px
</style>
