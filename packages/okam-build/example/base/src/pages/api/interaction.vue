<template>
    <view class="interaction-wrap">
        <view class="show-toast">
            <button type="primary" @click="showToast">showToast</button>
            <button type="warn" @click="showCustomIconToast">自定义 Icon showToast</button>
            <button type="default" @click="showLoadingToast">Loading showToast</button>
        </view>
        <view class="show-action">
            <button type="primary" @click="showActionSheet">showActionSheet</button>
        </view>
        <view class="show-modal">
            <button type="primary" @click="showModal">showModal</button>
        </view>
        <view class="show-loading">
            <button type="primary" @click="showLoading">showLoading</button>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: '交互'
    },

    data: {
    },

    methods: {
        showToast() {
            this.$api.showToast({
                title: '这是 Toast'
            });
        },

        showCustomIconToast() {
            this.$api.showToast({
                title: '自定义 Icon Toast',
                image: require('../../common/img/okam.png')
            });
        },

        showLoadingToast() {
            this.$api.showToast({
                title: 'Loading Toast',
                icon: 'loading'
            });
        },

        showActionSheet() {
            this.$api.showActionSheet({
                itemList: ['选我', '测试111', 'test'],
                itemColor: 'red',
                success(res) {
                    console.log('action success', res)
                },
                fail(res) {
                    console.log('action fail', res)
                }
            });
        },

        showModal() {
            this.$api.showModal({
                title: '提示',
                content: '这是一个模态弹窗水电费是否水电费是否的水电费是否水电费是否大是大非舒服舒服sdfsf',
                showCancel: false,
                // cancelText: 'cancel',
                // cancelColor: '#ccc',
                // confirmText: 'confirm',
                // confirmColor: '#F44336',
                success(res) {
                    console.log('success', res)
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                },
                fail(res) {
                    console.log('fail', res)
                }
            });
        },

        showLoading() {
            this.$api.showLoading({
                title: '加载中，不要急。。。',
                mask: true,
                success(res) {
                    console.log('mask success', res);
                },
                fail(res) {
                    console.log('mask fail', res);
                }
            });

            // setTimeout(() => {
            //     this.$api.hideLoading({
            //         success(res) {
            //             console.log('mask hide success', res);
            //         },
            //         fail(res) {
            //             console.log('mask hide fail', res);
            //         }
            //     });
            // }, 3000);
        }
    }
};
</script>
<style lang="stylus">
.interaction-wrap
    padding: 20px
    background: #fff

</style>
