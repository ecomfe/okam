<template>
    <div class="design-width-wrap">
        <div class="design-title">设计稿宽度为1242下</div>
        <div
            v-for="(item, index) in list"
            :key="index"
            class="offline-institution-item"
            :class="{
                'active': index === clickNum
            }"
            @click="handleClickItem(item)"
            style= "display: none"
        >
            <div class="item-shop-inner">
                <div
                    class="item-icon"
                    :style="{
                        backgroundImage: 'url(' + item.avatar + ')'
                    }"
                />
                <div class="item-content">
                    <div class="item-title">
                        <div class="item-name">{{ item.name }}</div>
                        <div v-if="item.isChain == 1" class="item-chain-tag">连锁</div>
                    </div>
                    <div class="item-rank">
                        <div
                            v-if="item.due30days"
                            class="offer-num"
                        >
                            {{ item.due30days }}人已预约
                        </div>
                    </div>
                    <div
                        v-for="(lItem, i) in item.categoryLv2"
                        id="border1px-all"
                        :key="i"
                        class="item-tags"
                    >
                        {{ lItem }}
                    </div>
                    <div class="item-address">
                        <div class="add-detail">
                            {{ item.location }}
                        </div>
                        <div
                            v-if="item.lbs_dist"
                            class="add-distance"
                        >
                            {{ item.lbs_dist }}
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="item.top_course && item.top_course.length"
                class="item-course-inner"
            >
                <div
                    v-for="(dItem, i) in item.top_course"
                    :key="i"
                    class="course-item"
                    @click.stop="courseItem(dItem)"
                >   
                    <div class="course-free">
                        <span v-if="dItem.minprice === '0'" class="course-tag" />
                    </div>
                    <div id="border1px-top" class="course-content">
                        <div class="course-icon" />
                        <div class="course-title">
                            {{ dItem.name }}
                        </div>
                        <div v-if="dItem.minprice" class="course-price">
                            <span class="course-price42">￥</span>{{ dItem.minprice }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    config: {
        navigationBarTitleText: '样式单位转换'
    },
    data: {
        list: [
            {
                "shop_id": "85465234789711",
                "score": 5,
                "type": "shop",
                "name": "重庆朗阁雅思托福留学语言培训中心(解放碑校区)",
                "avatar": "https://midpf-account.cdn.bcebos.com/e53ba346dbc1cc27df36c61506618b86.png",
                "isSchool": 0,
                "top_course": [
                    {
                        "id": "105566036294204",
                        "name": "职称英语培训",
                        "maxprice": "6000",
                        "minprice": "2000"
                    },
                    {
                        "id": "87882017105258",
                        "name": "雅思模考精讲课",
                        "maxprice": "1080",
                        "minprice": "100"
                    }
                ],
                "isChain": "0",
                "lbs_dist": "",
                "location": "渝中区",
                "categoryLv2": [
                    "留学考试/培训",
                    "英语",
                    "韩语"
                ],
                "due30days": 530
            }
        ],
        clickNum: 0
    },
    methods: {
    },
    onShow(option) {
        console.log('[design-width] getCurrentPages>>>>', getCurrentPages());
    }
};
</script>
<style lang="stylus">
.design-width-wrap
    background-color #fff
    .design-title
        font-size 42px;
#border1px-all
    position relative
    display inline-block
    padding 2px 5px /* px2rpx: no */
    border-all(#e0e0e0, 24px)

#border1px-top
    position relative
    border1px-top(#eaeaea)

.offline-institution-item
    background-color #fff
    margin 0 51px 30px
    border-radius 30px
    .item-shop-inner
        display flex
        padding 45px 45px 51px
        .item-icon
            width 267px
            height 267px
            background-size cover
            background-repeat no-repeat
            background-position center
            border-radius 27px
            &:after
                content ''
                display block
                background radial-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.05) 100%)
                width 100%
                height 100%
                border-radius 27px
        .item-content
            flex 1
            margin-left 24px
        .item-title
            display flex
            justify-content space-between
            align-items center
            font-size 48px
            color #1f1f1f
            padding-bottom 1px
        .item-name
            width 570px
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
            margin-top -2px  /* px2rpx: no */
            font-weight 500
        .item-chain-tag
            position relative
            top -2px  /* px2rpx: no */
            background rgba(72, 142, 255, .1)
            border-radius 30px
            padding 0 12px
            width 78px
            height 57px
            line-height 57px
            font-size 33px
            color #448BFF
            text-align center
        .item-rank
            margin-bottom 3px
            display flex
            align-items center
            .offer-num
                position relative
                top 2px /* px2rpx: no */
                padding-left 24px
                font-size 39px
                color #555
        .item-tags
            text-align center
            margin-bottom 21px
            margin-right 15px
            font-size 36px
            line-height 36px
            color #999
        .item-address
            display flex
            justify-content space-between
            font-size 39px
            color #999
            .add-detail
                text-overflow ellipsis
                overflow hidden
                white-space nowrap

    .item-course-inner
        margin -33px 51px 12px
        padding-bottom 9px
        .course-item
            display flex
            align-items center
            color #555
        .course-free
            display flex
            justify-content flex-end
            width 261px
            margin-right 30px
            .course-tag 
                display inline-block
                width 114px
                height 57px  
                background url('https://midpf-material.cdn.bcebos.com/43d3a846da66edad7107dcd1d62f7368.png') no-repeat 0 0
                background-size 100% 100%
        .course-price
            font-size 39px
            color #FB705A
            &42
                font-size 42px
        .course-content
            flex 1
            padding 30px 0
            font-size 39px
            line-height 45px
            display flex
            align-items center
        .course-icon
            display inline-block
            margin-right 15px
            width 45px
            height 45px
            background url('https://midpf-material.cdn.bcebos.com/db124218448e3e7252d61ef0594e8a9f.png') no-repeat 0 0
            background-size 100% 100%
        .course-title
            flex 1
            ellipsis()
            max-width 804px
            line-height 63px
</style>
