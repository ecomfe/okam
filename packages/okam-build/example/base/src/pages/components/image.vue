<template>
    <view class="image-component-wrap">
         <view class="section section-gap" v-for="(item, index) in array" :key="index">
            <view class="section-title">{{item.text}}</view>
            <view class="section-ctn">
                <image
                style="width: 200px; height: 200px; border: 1px solid #0000ff; background-color: #eeeeee;"
                :mode="item.mode"
                :src="src"
                @load="loadImg"
                @error="loadError"
                ></image>
            </view>
        </view>
        <view class="lazy-load-img-wrap" v-for="(item, index) in lazyLoadImgs" :key="item">
            <image
                :lazyLoad="true"
                mode="aspectFit"
                class="lazy-load-img"
                :src="item"
                @load="lazyLoadImg"
                @error="lazyLoadError"
                ></image>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Image Component'
    },

    data: {
        array: [
            {
                mode: 'scaleToFill',
                text: 'scaleToFill：不保持纵横比缩放图片，使图片完全适应'
            },
            {
                mode: 'widthFix',
                text: 'widthFix: 宽度不变，高度自动变化，保持原图宽高比不变'
            },
            {
                mode: 'aspectFit',
                text: 'aspectFit：保持纵横比缩放图片，使图片的长边能完全显示出来'
            },
            {
                mode: 'aspectFill',
                text: 'aspectFill：保持纵横比缩放图片，只保证图片的短边能完全显示出来'
            },
            {
                mode: 'top',
                text: 'top：不缩放图片，只显示图片的顶部区域'
            },
            {
                mode: 'bottom',
                text: 'bottom：不缩放图片，只显示图片的底部区域'
            },
            {
                mode: 'center',
                text: 'center：不缩放图片，只显示图片的中间区域'
            },
            {
                mode: 'left',
                text: 'left：不缩放图片，只显示图片的左边区域'
            },
            {
                mode: 'right',
                text: 'right：不缩放图片，只显示图片的右边边区域'
            },
            {
                mode: 'top left',
                text: 'top left：不缩放图片，只显示图片的左上边区域'
            },
            {
                mode: 'top right',
                text: 'top right：不缩放图片，只显示图片的右上边区域'
            },
            {
                mode: 'bottom left',
                text: 'bottom left：不缩放图片，只显示图片的左下边区域'
            },
            {
                mode: 'bottom right',
                text: 'bottom right：不缩放图片，只显示图片的右下边区域'
            }
        ],
        src: require('./timg.jpg'),
        lazyLoadImgs: [
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552155804514&di=0fa6ebfdd1dabbb301650c80aa15fcc8&imgtype=0&src=http%3A%2F%2Fpic1.win4000.com%2Fwallpaper%2F0%2F5601195554177.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552155852672&di=85b570ca234b1c1a0481da35ca2a5a31&imgtype=0&src=http%3A%2F%2Fpic1.16pic.com%2F00%2F06%2F41%2F16pic_641310_b.jpg',
            'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1552155924076&di=2603ab5ea8957d2417189ae0c25181fe&imgtype=0&src=http%3A%2F%2Fpic8.nipic.com%2F20100628%2F5260632_235701037236_2.jpg',
            'https://unknown.com/xxx.png'
        ]
    },

    methods: {
        loadImg(e) {
            console.log('load image done', e);
        },

        loadError(e) {
            console.log('load image error', e);
        },

        lazyLoadImg(e) {
            console.log('load image done', e);
        },

        lazyLoadError(e) {
            console.log('load image error', e);
        }
    }
};
</script>
<style lang="stylus">
.image-component-wrap
    padding: 20px
    background: #fff
    .result-msg
        padding: 20px 0
        color: #888
        word-break: break-all

    .lazy-load-img-wrap
        padding: 20px

    .lazy-load-img
        margin: 20px 0
        width: 200px
        height: 200px
        background-color: #eeeeee
        border: 1px solid #F44336
</style>
