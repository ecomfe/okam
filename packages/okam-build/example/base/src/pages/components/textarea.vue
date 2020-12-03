<template>
    <view class="textarea-component-wrap">
        <textarea class="input" placeholder="please input..." />
        <textarea class="input" placeholder="hello" :value="value" />
        <view class="row">
            <view class="title">Auto height:</view>
            <textarea class="input" @linechange="onLineChange" :value="autoHeightValue" auto-height/>
        </view>
        <view class="row">
            <view class="title">Maxlength input:</view>
            <textarea class="input" :value="value" maxlength="8" />
            <textarea class="input" :value="value" maxlength="-1" />
        </view>
        <view class="row">
            <view class="title">Focus input:</view>
            <textarea class="input" @input="onInput" @blur="onBlur" @focus="onFocus" :value="input" :cursor="cursor" :focus="focus" />
            <button @click="focusInput">Focus input</button>
            <view class="result-msg">{{msg}}</view>
            <view class="result-msg">{{input}}</view>
        </view>
        <view class="row">
            <view class="title">Disabled input:</view>
            <textarea class="input" disabled placeholder="hello" :value="value" />
            <textarea class="input" disabled placeholder="hello" />
        </view>
        <view class="row">
            <view class="title">Placehoder style:</view>
            <textarea class="input" placeholder="hello" placeholder-style="color: red"/>
            <textarea class="input" placeholder="hello" placeholder-class="my-placehoder" />
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Textarea Component'
    },

    data: {
        msg: '',
        value: ['abcefg', 'hhisss'].join('\n'),
        autoHeightValue: ['abcefg', 'hhisss'].join('\n'),
        focus: true,
        input: 'abcefgsss',
        cursor: 2
    },

    methods: {
        focusInput() {
            this.focus = true;
        },

        onFocus(e) {
            this.focus = true;
            console.log('focus', e);
            this.msg = "fucsing..";
        },

        onBlur(e) {
            this.focus = false;
            console.log('blur', e);
            this.msg = "blur..";
        },

        onInput(e) {
            console.log('input', e);
            this.value = e.detail.value;
            this.input = this.value;
        },

        onLineChange(e) {
            console.log('line change', e);
        }
    }
};
</script>
<style lang="stylus">
.textarea-component-wrap
    padding: 20px
    background: #fff

    .input
        margin: 10px 0
        padding: 5px
        border: 1px solid #ccc
        width: 100%
        height: 50px

    .my-placehoder
        color: red

    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
