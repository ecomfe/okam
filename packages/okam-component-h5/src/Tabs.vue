<template>
    <div
        class="okam-tabs"
        :class="{
            'okam-tabs-line': tabsBackgroundColor === '#fff'
        }"
        :style="{
            backgroundColor: tabsBackgroundColor
        }"
    >
        <div
            class="okam-tabs-content"
            :class="{
                'okam-tabs-content-scroll': scrollable
            }"
        >
            <slot/>
            <div
                v-if="showBuoy"
                class="okam-tabs-content-buoy"
                :style="buoyStyle"
            />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        /**
         * tabs 背景色
         */
        tabsBackgroundColor: {
            type: String,
            default: '#fff'
        },
        /**
         * tabs 激活 tab-item 文字颜色
         */
        tabsActiveTextColor: {
            type: String,
            default: '#000'
        },
        /**
         * tabs 非激活 tab-item 文字颜色
         */
        tabsInactiveTextColor: {
            type: String,
            default: '#666'
        },
        /**
         * tabs 激活 tab-item 下划线颜色
         */
        tabsUnderlineColor: {
            type: String,
            default: '#333'
        },
        /**
         * 当前激活 tab-item 的对应的 name 值，须搭配 bindtabchange 一起使用
         */
        activeName: {
            type: String,
            default: ''
        },
        /**
         * 当前 tabs 视图中最多容纳的 tab-item 数量，低于此数量均分排列，超出此数量划屏
         */
        maxTabItemAmount: {
            type: Number,
            default: 5
        }
        // List to be supported
        // https://smartprogram.baidu.com/docs/develop/component/tabs/
        // url-query-name
    },
    data() {
        return {
            curTab: 0,
            showBuoy: false,
            scrollable: false,
            itemLeftArr: []
        }
    },
    created() {
        this.$on('changeTab', tab => {
            if (this.curTab !== tab) {
                this.$children[this.curTab].isActive = false;
                this.$children[tab].isActive = true;
                this.curTab = tab;

                const {name, label} = this.$children[tab];
                this.$emit('tabchange', {
                    detail: {
                        name,
                        label
                    }
                });
            }
        });
        // 子节点创建后才能计算首次浮标位置
        this.$nextTick(() => {
            this.showBuoy = true;
            if (this.$children.length > this.maxTabItemAmount) {
                this.scrollable = true;
            }
        });
    },
    computed: {
        buoyStyle() {
            let style = {
                backgroundColor: this.tabsUnderlineColor
            };
            const tabLen = this.$children.length;

            if (!this.scrollable) {
                // 均分导航
                style.left = tabLen ? `${(100 / (tabLen * 2)) * (1 + this.curTab * 2)}%` : '0px';
            } else {
                // 滚动导航
                // debugger
                let arr = this.itemLeftArr;
                if (arr.length === 0) {
                    let lenArr = []; // 单item长度数组
                    let itemLeftArr = []; // item起点长度数组
                    lenArr = this.$children.map(item => 
                        (item.label.length + 2) * 16
                    );
                    lenArr.unshift(0);
                    let maxLen = lenArr.reduce(function(pre, cur, i) {
                        itemLeftArr[i - 1] = pre;
                        return pre + cur;
                    });
                    itemLeftArr.push(maxLen);

                    arr = itemLeftArr;
                }

                style.left = (arr[this.curTab] + arr[this.curTab + 1]) / 2 + 'px';
            }

            return style;
        }
    }
};
</script>

<style lang="stylus">
.okam-tabs
    position relative
    width 100%
    height 40px
    box-sizing border-box
    &-line
        border-bottom 1px solid #e6e6e6
    &-content
        position relative
        width 100%
        display flex
        flex-direction row
        &-buoy
            position absolute
            width 32px
            height 2px
            left 0
            bottom 0
            transform translateX(-50%)
            transition all .24s
        &-scroll
            white-space nowrap
            overflow-x scroll
            &::-webkit-scrollbar
                display none
</style>