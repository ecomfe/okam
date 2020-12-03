<template>
    <div class="component-container">
        <div class="okam-demo-title">默认样式</div>
        <o-tabs
            :active-name="checkTab"
            @tabchange="onTabClick"
        >
            <o-tabs-item
                v-for="(tab, index) in tabsData"
                :key="index"
                :name="tab.name"
                :label="tab.label"
            />
        </o-tabs>
        <br/>

        <div class="okam-demo-title">自定义样式</div>
        <o-tabs
            tabs-background-color="#38f"
            tabs-active-text-color="#fff"
            tabs-inactive-text-color="#fff"
            tabs-underline-color="#fff"
        >
            <o-tabs-item
                v-for="(tab, index) in tabsData2"
                :key="index"
                :name="tab.name"
                :label="tab.label"
            />
        </o-tabs>
        <br/>

        <div class="okam-demo-title">可横滑显示</div>
        <o-tabs
            active-name="demo"
            :max-tab-item-amount="5"
        >
            <o-tabs-item
                v-for="(tab, index) in tabsData3"
                :key="index"
                :name="tab.name"
                :label="tab.label"
            />
        </o-tabs>
    </div>
</template>

<script>
import OTabs from 'okam/Tabs';
import OTabsItem from 'okam/TabsItem';
export default {
    components: {
        OTabs,
        OTabsItem
    },
    data() {
        return {
            tabsData: [
                {
                    name: '一',
                    label: '标签一'
                },
                {
                    name: '二',
                    label: '标签二'
                },
                {
                    name: '三',
                    label: '标签三'
                }
            ],
            tabsData2: [
                {
                    name: '一',
                    label: '标签一'
                },
                {
                    name: '二',
                    label: '标签二'
                },
                {
                    name: '三',
                    label: '标签三'
                },
                {
                    name: '四',
                    label: '标签四'
                },
                {
                    name: '五',
                    label: '标签五'
                }
            ],
            tabsData3: [
                {
                    name: '一',
                    label: '标签一'
                },
                {
                    name: '二',
                    label: '标签二'
                },
                {
                    name: '三',
                    label: '标签三'
                },
                {
                    name: '四',
                    label: '标签四'
                },
                {
                    name: '五',
                    label: '标签五'
                },
                {
                    name: '六',
                    label: '标签六'
                },
                {
                    name: '七',
                    label: '标签七'
                }
            ],
            checkTab: '一'
        }
    },
    methods: {
        onTabClick(e) {
            this.checkTab = e.detail.name;
        }
    }
};
</script>

<style lang="stylus">
.okam-demo-title
    font-size 18px
    font-weight 700
    padding 10px 17px
</style>