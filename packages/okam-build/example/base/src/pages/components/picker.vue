<template>
    <view class="picker-component-wrap">
        <view class="row">
            <view class="title">普通选择器:</view>
            <picker @change="onNormalPickerChange" @cancel="onCancel"
                :disabled="disabled"
                :value="normal.index" :range="normal.arr">
                <view class="picker">
                当前选择：{{normal.arr[normal.index]}}
                </view>
            </picker>
            <button @click="togglePickerEnable">禁用/开启 Picker</button>
        </view>
        <view class="row">
            <view class="title">普通选择器-对象类型:</view>
            <picker @change="onNormalPickerChange" @cancel="onCancel"
                range-key="name"
                :value="normal.index" :range="normal.objArr">
                <view class="picker">
                当前选择：{{normal.objArr[normal.index].name}}
                </view>
            </picker>
        </view>
        <view class="row">
            <view class="title">多列选择器:</view>
            <picker
                mode="multiSelector"
                @change="onMultiPickerChange"
                @columnchange="onMultiPickerColumnChange"
                @cancel="onCancel"
                :value="multi.index"
                :range="multi.arr">
                <view class="picker">
                    当前选择：{{multiSelectedValue}}
                </view>
            </picker>
        </view>
        <view class="row">
            <view class="title">多列选择器-对象类型:</view>
            <picker
                mode="multiSelector"
                range-key="name"
                @change="onMultiPickerChange"
                @columnchange="onMultiPickerColumnChange"
                @cancel="onCancel"
                :value="multi.index"
                :range="multi.objArr">
                <view class="picker">
                    当前选择：{{multiSelectedObjValue}}
                </view>
            </picker>
        </view>
        <view class="row">
            <view class="title">时间选择器:</view>
            <picker
                mode="time"
                :value="time"
                start="09:01"
                end="21:01"
                @cancel="onCancel"
                @columnchange="onMultiPickerColumnChange"
                @change="onTimeChange">
                <view class="picker">
                    当前选择: {{time}}
                </view>
            </picker>
        </view>
        <view class="row">
            <view class="title">日期选择器:</view>
            <picker
                mode="date"
                :value="date"
                start="2015-09-15"
                end="2017-09-15"
                @cancel="onCancel"
                @change="onDateChange">
                <view class="picker">
                    当前选择: {{date}}
                </view>
            </picker>
        </view>
        <view class="row">
            <view class="title">日期选择器 - Month:</view>
            <picker
                mode="date"
                fields="month"
                :value="date"
                start="2015-09"
                end="2019-09"
                @cancel="onCancel"
                @change="onDateChange">
                <view class="picker">
                    当前选择: {{date}}
                </view>
            </picker>
        </view>
        <view class="row">
            <view class="title">日期选择器 - Year:</view>
            <picker
                mode="date"
                fields="year"
                :value="date"
                @cancel="onCancel"
                @change="onDateChange">
                <view class="picker">
                    当前选择: {{date}}
                </view>
            </picker>
        </view>
        <view class="row">
            <view class="title">省市区选择器:</view>
            <picker
                mode="region"
                @change="onRegionChange"
                @cancel="onCancel"
                :value="region">
                <view class="picker">
                当前选择：{{region}}
                </view>
            </picker>
        </view>
        <view class="row">
            <view class="title">省市区选择器 - custom item:</view>
            <picker
                mode="region"
                @change="onRegionChange"
                @cancel="onCancel"
                :value="region"
                :custom-item="customItem">
                <view class="picker">
                当前选择：{{region}}
                </view>
            </picker>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Picker Component'
    },

    data: {
        msg: '',
        disabled: false,
        normal: {
            index: 0,
            arr: ['美国', '中国', '巴西', '日本'],
            objArr: [
                {
                    id: 0,
                    name: '美国'
                },
                {
                    id: 1,
                    name: '中国'
                },
                {
                    id: 2,
                    name: '巴西'
                },
                {
                    id: 3,
                    name: '日本'
                }
            ]
        },
        multi: {
            index: [0, 0, 0],
            arr: [
                ['无脊柱动物', '脊柱动物'],
                ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'],
                ['猪肉绦虫', '吸血虫']
            ],
            objArr: [
                [
                    {
                        id: 0,
                        name: '无脊柱动物'
                    },
                    {
                        id: 1,
                        name: '脊柱动物'
                    }
                ],
                [
                    {
                        id: 0,
                        name: '扁性动物'
                    },
                    {
                        id: 1,
                        name: '线形动物'
                    },
                    {
                        id: 2,
                        name: '环节动物'
                    },
                    {
                        id: 3,
                        name: '软体动物'
                    },
                    {
                        id: 3,
                        name: '节肢动物'
                    }
                ],
                [
                    {
                        id: 0,
                        name: '猪肉绦虫'
                    },
                    {
                        id: 1,
                        name: '吸血虫'
                    }
                ]
            ]
        },
        date: '2016-09-01',
        time: '12:01',
        region: ['广东省', '广州市', '海珠区'],
        customItem: '全部'
    },

    computed: {
        multiSelectedValue() {
            let arr = this.multi.arr;
            let index = this.multi.index;
            let value = [];
            index.forEach((item, idx) => {
                value.push(arr[idx][item]);
            });
            return value;
        },
        multiSelectedObjValue() {
            let arr = this.multi.objArr;
            let index = this.multi.index;
            let value = [];
            index.forEach((item, idx) => {
                value.push(arr[idx][item].name);
            });
            return value;
        }
    },

    methods: {

        togglePickerEnable() {
            this.disabled = !this.disabled;
        },

        onCancel(e) {
            console.log('picker cancel', e);
        },

        onNormalPickerChange(e) {
            console.log('normal pick change', e);
            this.normal.index = e.detail.value;
        },

        onMultiPickerChange(e) {
            console.log('multiple pick change', e);
            this.multi.index = e.detail.value;
        },

        onMultiPickerColumnChange(e) {
            console.log('multiple pick change', e);
        },

        onTimeChange(e) {
            console.log('time change', e);
            this.time = e.detail.value;
        },

        onDateChange(e) {
            console.log('date change', e);
            this.date = e.detail.value;
        },

        onRegionChange(e) {
            console.log('region change', e);
            this.region = e.detail.value;
        }
    }
};
</script>
<style lang="stylus">
.picker-component-wrap
    padding: 20px
    background: #fff

    .row
        padding: 10px
        margin: 10px
        border: 1px solid #ccc

    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all
</style>
