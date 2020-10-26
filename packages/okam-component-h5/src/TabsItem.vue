<template>
    <div
        class="okam-tabs-item"
        @click="tabItemClickFn"
    >
        <div
            ref="tabItem"
            class="okam-tabs-item-cell"
            :class="{
                'okam-tabs-item-cell-pad': isScrollItem,
                'okam-tabs-item-cell-active': isActive
            }"
            :style="{
                color: isActive ? actTxtColor : txtColor
            }"
        >
            {{ label }}
        </div>
    </div>
</template>
<script>
export default {
    props: {
        /**
         * tab-item 内显示的文字
         */
        label: {
            type: String,
            required: true
        },
        /**
         * tab-item 对应的 name 值
         */
        name: {
            type: String,
            required: true
        }
        // List to be supported
        // https://smartprogram.baidu.com/docs/develop/component/tab-item/
        // badge-type
        // badge-text
    },
    data() {
        return {
            isActive: false,
            txtColor: '',
            actTxtColor: '',
            underlineColor: '',
            actName: '',
            isScrollItem: false
        }
    },
    created() {
        // const curNodeIdx = this.$vnode.key;
        // const curTab = this.$parent.curTab;
        if (this.$vnode.key === this.$parent.curTab) {
            this.isActive = true;
        }

        const {
            tabsActiveTextColor,
            tabsInactiveTextColor,
            tabsUnderlineColor,
            activeName,
        } = this.$parent;

        this.txtColor = tabsInactiveTextColor;
        this.actTxtColor = tabsActiveTextColor;
        this.underlineColor = tabsUnderlineColor;
        this.actName = activeName;
    },
    mounted() {
        this.$nextTick(() => {
            if (this.$parent.scrollable) {
                this.isScrollItem = true;
            }
        });
    },
    methods: {
        tabItemClickFn() {
            const tabRef = this.$refs.tabItem;
            tabRef.scrollIntoView && tabRef.scrollIntoView({
                behavior: 'smooth',
                inline: 'nearest'
            });
            this.$parent.$emit('changeTab', this.$vnode.key);
        }
    }
};
</script>

<style lang="stylus">
.okam-tabs-item
    display flex
    justify-content center
    align-items center
    height 40px
    flex 1
    font-size 16px
    &-cell
        &-pad
            padding 0 16px
        &-active
            font-weight 700
            transform translateY(-1px)
</style>