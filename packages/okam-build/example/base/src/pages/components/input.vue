<template>
    <view class="input-component-wrap">
        <input class="input" placeholder="please input..." />
        <input class="input" placeholder="hello" type="text" :value="value" />
        <view class="row">
            <view class="title">Password input:</view>
            <view><input class="input" password :value="value" /></view>
        </view>
        <view class="row">
            <view class="title">Number type input:</view>
            <input class="input" type="number" />
        </view>
        <view class="row">
            <view class="title">Idcard type input:</view>
            <input class="input" type="idcard" />
        </view>
        <view class="row">
            <view class="title">Digit type input:</view>
            <input class="input" type="digit" />
        </view>
        <view class="row">
            <view class="title">Maxlength input:</view>
            <input class="input" :value="value" maxlength="8" />
            <input class="input" :value="value" maxlength="-1" />
        </view>
        <view class="row">
            <view class="title">Focus input:</view>
            <input class="input" @input="onInput" @blur="onBlur" @focus="onFocus" :value="input" :cursor="cursor" :focus="focus" />
            <button @click="focusInput">Focus input</button>
            <view class="result-msg">{{msg}}</view>
             <view class="result-msg">{{input}}</view>
        </view>
        <view class="row">
            <view class="title">Disabled input:</view>
            <input class="input" disabled placeholder="hello" type="text" :value="value" />
            <input class="input" disabled placeholder="hello" type="text" />
        </view>
        <view class="row">
            <view class="title">Placehoder style:</view>
            <input class="input" placeholder="hello" placeholder-style="color: red"/>
            <input class="input" placeholder="hello" placeholder-class="my-placehoder" />
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Input Component'
    },

    data: {
        msg: '',
        value: 'abcefg',
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
        }
    }
};
</script>
<style lang="stylus">
.input-component-wrap
    padding: 20px
    background: #fff

    .input
        margin: 10px
        padding: 5px
        border: 1px solid #ccc

    .my-placehoder
        color: red

    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
