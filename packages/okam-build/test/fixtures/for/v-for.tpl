<div class="example">
    <div v-for="item in 5">
        遍历数字5: {{item}}
    </div>
    <div class="hello" v-for="(item, index) of ['of', 2]">
        for of 遍历数组{{item}}
    </div>
    <view v-for="item of {a:1, b:2}">of遍历字面量对象: hello {{index}} {{item}}</view>
    <view v-for="item of {a, b}">of遍历字面量对象2: hello {{index}} {{item}}</view>
    <view v-for="item of {a2: a, b2: b}">of遍历字面量对象3: hello {{index}} {{item}}</view>
</div>
