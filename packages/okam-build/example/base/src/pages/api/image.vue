<template>
    <view class="api-image-wrap">
        <div class="image-view">
            <img
                class="preview-image"
                :src="img.path || previewUrl"
            />
        </div>
        <div
            class="image-info"
        >
            <div>图片地址：{{ previewUrl }}</div>
            <div>图片宽度: {{ info.width }}</div>
            <div>图片高度: {{ info.height }}</div>
            <div>图片类型: {{ info.type }}</div>
        </div>
        <button
            class="btn"
            @click="chooseImage"
        >ChooseImage</button>
        <button
            class="btn"
            @click="getImageInfo"
        >getImageInfo</button>
        <button
            class="btn"
            @click="previewImage"
        >previewImage</button>
    </view>
</template>
<script>
export default {
    config: {
        title: '图片API'
    },

    data () {
        return {
            img: {},
            info: {},
            previewUrl: 'https://midpf-material.cdn.bcebos.com/9300514013bed0a1e34b87318da09d11.jpeg',
            image1: 'https://b.bdstatic.com/miniapp/image/swan-preview-image-2-zip.png',
            image2: 'https://b.bdstatic.com/miniapp/image/swan-preview-image-zip.png',
            image3: 'https://b.bdstatic.com/miniapp/image/swan-preview-image-origin.png'
        }
    },

    methods: {
        chooseImage() {
            const that = this;
            this.$api.chooseImage({
                success(res) {
                    that.img = res.tempFiles[0];
                    console.log('choose success done', res);
                },
                complete(res) {
                    console.log('choose complete done', res);
                }
            });
        },
        getImageInfo() {
            const that = this;
            this.$api.getImageInfo({
                src: that.previewUrl,
                success: res => {
                    that.info = res;
                    console.log('getImageInfo success', res);
                },
                fail: err => {
                    console.log('getImageInfo fail', err);
                }
            });
        },
        previewImage() {
            this.$api.previewImage({
                current: this.image1,
                urls: [this.image2, this.image1],
                success: res => {
                    console.log('previewImage success');
                },
                fail: err => {
                    console.log('previewImage fail', err);
                }
            });
        }
    }
};
</script>
<style lang="stylus">
.api-image-wrap
    padding 20px
    background #fff

.btn
    margin-bottom 10px
.image-view
    border 3px dashed #cfcfcf
    text-align center
    margin-bottom 20px
    height 200px
.preview-image
    max-width 100%
.image-info
    margin-bottom 10px
</style>
