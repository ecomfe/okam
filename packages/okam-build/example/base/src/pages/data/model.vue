<template>
    <view class="data-model-wrap">
        <view class="example-item">
            <view class="sub-title">不支持内容</view>
            <view>不支持 mode 指令, inputVal: {{inputVal}}</view>
            <input model="inputVal" />
            <view>不支持标签 radio, inputVal: {{inputVal}}</view>
            <radio v-model="inputVal"/>不支持
            <view>不支持标签 radio, inputVal: {{inputVal}}</view>
            <checkbox v-model="inputVal"/>不支持
            <view>不支持标签 view, inputVal: {{inputVal}}</view>
            <view v-model="inputVal">不支持 </view>
        </view>
        <view class="example-item">
            <view class="sub-title">属性冲突</view>
            <view>input has value attr「value=input1」: {{input1}}</view>
            <input v-model="input1" value={{input1}}/>
            <view>input has value attr「:value="input2"」: {{input2}}</view>
            <input v-model="input2" :value="input2" />
            <view>input has value attr「v-bind:value="input3"」: {{input3}}</view>
            <input v-model="input3" v-bind:value="input3" />
        </view>
        <view class="example-item">
            <view class="sub-title">事件冲突</view>
            <view>input has event「@input.capture, @input.once」: {{input1}}</view>
            <input v-model="input1" @input.capture="fn('@input.capture')" @input.once="fn('@input.once')"/>
            <view>对比没有 v-model「@input.capture, @input.once」</view>
            <input @input.capture="fn('@input.capture')" @input.once="fn('@input.once')"/>
            <view>input has event「@input.capture」: {{input2}}</view>
            <input v-model="input2" @input.capture="fn('bindinput')"/>
            <view>对比没有 v-model「@input.capture」</view>
            <input @input.capture="fn('bindinput')"/>
            <swan-env>
            <view>input has event「bindinput」: {{input3}}</view>
            <input v-model="input3" bindinput="fn"/>
            <view>对比没有 v-model「bindinput」</view>
            <input bindinput="fn"/>
            </swan-env>
            <wx-env>
            <view>input has event「bindinput」: {{input3}}</view>
            <input v-model="input3" bindinput="fn"/>
            <view>对比没有 v-model「bindinput」</view>
            <input bindinput="fn"/>
            </wx-env>
            <tt-env>
            <view>input has event「bindinput」: {{input3}}</view>
            <input v-model="input3" bindinput="fn"/>
            <view>对比没有 v-model「bindinput」</view>
            <input bindinput="fn"/>
            </tt-env>
            <ant-env>
            <view>input has event「onInput」: {{input3}}</view>
            <input v-model="input3" onInput="fn"/>
            <view>对比没有 v-model「onInput」</view>
            <input onInput="fn"/>
            </ant-env>
        </view>
        <view class="example-item">
            <view class="sub-title">不同变量写法</view>
            <view>input1： {{inputVal}}</view>
            <input v-model="inputVal" />
            <view>input 「modelData.input」： {{modelData.input}}</view>
            <input v-model="modelData.input" />
            <view>input 「modelData.arr[0]」： {{modelData.arr[0]}}</view>
            <input v-model="modelData.arr[0]" />
            <view>input 「modelData.obj.input」： {{modelData.obj.input}}</view>
            <input v-model="modelData.obj.input" />
        </view>
        <view class="example-item">
            <view>textarea: {{textareaVal}}</view>
            <textarea v-model="textareaVal"></textarea>
        </view>
        <view class="example-item">
            <view>picker</view>
            <picker
                v-model="timeVal"
                mode="time"
                start="11:11"
                end="23:11">
                <view class="picker">
                    当前选择: {{timeVal}}
                </view>
            </picker>
        </view>
        <view class="example-item">
            <view>checkbox: {{checkboxVal}}</view>
            <checkbox-group v-model="checkboxVal">
                <label for="item in items">
                    <checkbox :value="item.name"/>
                    {{item.value}}
                </label>
            </checkbox-group>
        </view>
        <view class="example-item">
            <view>radio: {{radioVal}}</view>
            <radio-group v-model="radioVal">
                <label v-for="item in items">
                    <radio :value="item.name"/>
                    {{item.value}}
                </label>
            </radio-group>
        </view>
        <view class="example-item">
            <view>switch: {{switchVal}}</view>
            <switch name="switch1" v-model="switchVal" type="checkbox"></switch>
            <switch name="switch2" color="red"></switch>
        </view>
        <view class="example-item">
            <view>自定义组件: {{componentVal}}</view>
            <model-component v-model="componentVal" />
        </view>
        <view class="example-item">
            <view>特殊model的自定义组件: {{spComponentVal}}</view>
            <sp-model-component v-model="spComponentVal" />
        </view>
        <swan-env>
        <view class="example-item">
            <view class="sub-title">事件测试</view>
            <view id="wrap"
                bind:touchstart="handleTap1"
                capture-bind:touchstart="handleTap2">
                wrap
                  <view id="inner"
                    bind:touchstart="handleTap3"
                    capture-bind:touchstart="handleTap4">
                    text
                  </view>
            </view>
            <view id="wrap"
                @touchstart="handleTap1"
                @touchstart.capture="handleTap2">
                wrap
                  <view id="inner"
                    @touchstart="handleTap3"
                    @touchstart.capture="handleTap4">
                    text
                  </view>
            </view>
        </view>
        </swan-env>
    </view>
</template>

<script>
import ModelComponent from '../../components/ModelComponent';
import SpModelComponent from '../../components/SpModelComponent';

export default {
    config: {
        title: 'v-model支持'
    },
    components: {
        ModelComponent,
        SpModelComponent
    },
    data: {
        input1: '',
        input2: '',
        input3: '',
        inputVal: 'default value',
        checkboxVal: ['CHN'],
        timeVal: '14:00',
        radioVal: 'USA',
        switchVal: true,
        textareaVal: 'default value',
        componentVal: 'components',
        spComponentVal: 'sp',
        modelData: {
            input: 'default value',
            arr: [],
            obj: {
                input: ''
            }
        },
        items: [
            {name: 'USA', value: '美国'},
            {name: 'CHN', value: '中国', checked: true},
            {name: 'BRA', value: '巴西'},
            {name: 'JPN', value: '日本'},
            {name: 'ENG', value: '英国', disabled: true},
            {name: 'TUR', value: '法国'}
        ]
    },

    created() {

    },

    methods: {
        fn(e) {
            console.log('test', e);
        },
        handleTap1(e) {
            console.log('handleTap1', e);
        },
        handleTap2(e) {
            console.log('handleTap2', e);
        },
        handleTap3(e) {
            console.log('handleTap3', e);
        },
        handleTap4(e) {
            console.log('handleTap4', e);
        }
    }
}
</script>

<style lang="stylus">
.data-model-wrap
    position: relative
    padding: 20px
    box-sizing: border-box
    background: #ccc

    button
        margin: 15px 0

    .sub-title
        font-size: 28px
        text-align: center
        background: #e0dede
        margin-bottom: 10px

    .example-item
        padding: 10px 15px
        margin: 20px 0
        background: #fff

        input,
        textarea
            word-break: break-all
            width: 100%
            border: 1px solid #000

        .disabled
            color: #ccc

</style>
