<view class="example">
    <view s-for="item in [1,2,3,4,5]">
        遍历数字5: {{item}}
    </view>
    <view class="hello" s-for="item, index in ['of', 2]">
        for of 遍历数组{{item}}
    </view>
    <view s-for="item in {a:1, b:2}">of遍历字面量对象: hello {{index}} {{item}}</view>
    <view s-for="item in {a, b}">of遍历字面量对象2: hello {{index}} {{item}}</view>
    <view s-for="item in {a2: a, b2: b}">of遍历字面量对象3: hello {{index}} {{item}}</view>
</view>
