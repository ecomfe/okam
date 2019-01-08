<template>
    <view class="data-watch-wrap">
        <view class="example-item">
            <view>input1： {{inputVal}}</view>
            <input model="inputVal" />
            <view>input 「modelData.input」： {{modelData.input}}</view>
            <input v-model="modelData.input" />
            <view>input 「modelData.arr[0]」： {{modelData.arr[0]}}</view>
            <input v-model="modelData.arr[0]" />
            <view>input 「modelData.obj.input」： {{modelData.obj.input}}</view>
            <input v-model="modelData.obj.input" />
            <view>input has value attr「value=input1」: {{input1}}</view>
            <input v-model="input1" value={{input1}}/>
            <view>input has value attr「:value="input2"」: {{input2}}</view>
            <input v-model="input2" :value="input2" />
            <view>input has value attr「v-bind:value="input3"」: {{input3}}</view>
            <input v-model="input3" v-bind:value="input3" />
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
            <switch name="switch3" checked></switch>
        </view>
    </view>
</template>

<script>
export default {
    config: {
        title: 'v-model支持'
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

    }
}
</script>

<style lang="stylus">
.data-watch-wrap
    position: relative
    padding: 20px
    box-sizing: border-box
    background: #ccc

    button
        margin: 15px 0

    .example-item
        padding: 30px 15px
        margin: 20px 0
        background: #fff

        input,
        textarea
            width: 100%
            border: 1px solid #000

        .disabled
            color: #ccc

</style>
