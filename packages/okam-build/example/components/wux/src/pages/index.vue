<template>
    <view class="wux-home-page">
        <view class="title">Wux Weapp</view>
        <view class="title">按钮</view>
        <wux-button block type="balanced" @click="clickWux">balanced</wux-button>
        <wux-input-number default-value="1024"  />
        <wux-icon type="ios-add" />
    </view>
</template>

<script>
import WuxButton from 'wux-weapp/dist/button/index';
import WuxInputNumber from 'wux-weapp/dist/input-number/index';
import WuxIcon from 'wux-weapp/dist/icon/index';

export default {
    config: {
        title: 'Wux Weapp 支持'
    },

    components: {
        WuxButton,
        WuxIcon,
        WuxInputNumber
    },

    data: {
        items: [{
                id: '001',
                text: '房间',
                value: 1,
            },
            {
                id: '002',
                text: '成人',
                value: 2,
            },
        ],
        value: 1,
        testData: true
    },

    methods: {
        clickWux() {
            console.log('clickWux');
        },

        onChange(e) {
            console.log(e)
            this.setData({
                value: e.detail.value,
            })
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
