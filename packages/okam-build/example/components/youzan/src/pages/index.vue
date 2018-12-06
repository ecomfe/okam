<template>
    <view class="comp-page">
        <view class="title">有赞 Vant 组件</view>
        <van-progress percentage="50" />

        <van-icon name="close" />

        <van-button type="primary">主要按钮</van-button>
        <!-- <van-datetime-picker
          type="datetime"
          :value="currentDate"
          :minDate="minDate"
          :maxDate="maxDate"
          @input="onInput"
        /> -->
        <!-- <van-search
            :value="value"
            placeholder="请输入搜索关键词"
            show-action
            @search="onSearch"
            @cancel="onCancel"
        /> -->

        <text>{{currentDate}}<text>
    </view>
</template>

<script>
import VanButton from 'vant-weapp/dist/button/index';
import VanIcon from 'vant-weapp/dist/icon/index';
// import VanSearch from 'vant-weapp/dist/search/index';
import VanProgress from 'vant-weapp/dist/progress/index';
// import VanDatetimePicker from 'vant-weapp/dist/datetime-picker/index';

export default {
    config: {
        title: '有赞 Vant 组件支持'
    },

    components: {
        // VanDatetimePicker,
        VanProgress,
        // VanSearch,
        VanIcon,
        VanButton
    },

    data: {
        value: '',
        minHour: 10,
        maxHour: 20,
        minDate: new Date().getTime(),
        maxDate: new Date(2019, 10, 1).getTime(),
        currentDate: new Date().getTime(),
        active: 0,
        testData: true
    },

    methods: {
        onInput(e) {
            this.currentDate = e.detail;
        },

        onSearch(e) {
            this.$api.showToast({
                title: 'Received onSearch' + e.detail,
                duration: 3000
            });
        },

        onCancel(e) {
            this.$api.showToast({
                title: 'Received onCancel' + e.detail,
                duration: 3000
            });
        }
    }
};
</script>

<style lang="css">
.title {
    display: block;
    width: 100%;
    color: #f00;
    font-size: 20px;
    text-align: center;
}

</style>
