<template>
    <view class="api-image-wrap">
        <button @click="chooseImage">ChooseImage</button>
    </view>
</template>
<script>
export default {
    config: {
        title: '图片API'
    },

    data: {
    },

    methods: {
        chooseImage() {
            this.$api.chooseImage({
                success(res) {
                    console.log('choose success done', res);
                },
                complete(res) {
                    console.log('choose complete done', res);
                }
            });
        }
    }
};
</script>
<style lang="stylus">
.api-image-wrap
    padding: 20px
    background: #fff
</style>
