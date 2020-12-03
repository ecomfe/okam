<template>
    <view class="form-component-wrap">
        <form @submit="onFormSubmit" @reset="onFormReset">
            <view class="section section_gap">
                <view class="section__title">switch</view>
                <switch name="switch" checked @change="onChange"/>
            </view>
            <view class="section section_gap">
                <view class="section__title">slider</view>
                <slider name="slider" show-value @change="onChange"></slider>
            </view>

            <view class="section">
                <view class="section__title">input</view>
                <input name="input" :value="inputValue" placeholder="please input here" @input="onChange"/>
            </view>
            <view class="section section_gap">
                <view class="section__title">radio</view>
                <radio-group name="radio-group" @change="onChange">
                    <label v-for="item in radioData">
                        <radio :value="item.value" :checked="item.checked" />
                        {{item.label}}
                    </label>
                </radio-group>
            </view>
            <view class="section section_gap">
                <view class="section__title">checkbox</view>
                <checkbox-group name="checkbox" @change="onChange">
                    <label>
                        <checkbox value="checkbox1" />
                        checkbox1
                    </label>
                    <label>
                        <checkbox value="checkbox2" />
                        checkbox2
                    </label>
                </checkbox-group>
            </view>
            <view class="section section_gap">
                <view class="section__title">picker</view>
                <picker
                    mode="date"
                    name="picker"
                    start="2015-09-15"
                    end="2017-09-15"
                    @change="onDateChange">
                    <view class="picker">
                        当前选择: {{date}}
                    </view>
                </picker>
            </view>
            <view class="btn-area">
                <button form-type="submit">Submit</button>
                <button form-type="reset">Reset</button>
            </view>
        </form>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Form Component'
    },

    data: {
        inputValue: 'abc',
        date: '2016-03-04',
        radioData: [
            {label: 'radio1', value: 'radio1', checked: true},
            {label: 'radio2', value: 'radio2', checked: false}
        ],
        msg: ''
    },

    methods: {

        onFormSubmit(e) {
            console.log('submit', e);
        },

        onFormReset(e) {
            console.log('reset', e);
        },

        onDateChange(e) {
            console.log('data change', e);
            this.date = e.detail.value;
        },

        onChange(e) {
            console.log('change...', e);
        }
    }
};
</script>
<style lang="stylus">
.form-component-wrap
    padding: 20px
    background: #fff

    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
