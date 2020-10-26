<template>
    <view class="group">
        <view class="group-hd">
            <image class="group-logo" src="../../common/img/logo.png" />
            <view class="group-desc">以下将展示小程序开发框架能力</view>
        </view>

        <view for="(item, index) in items" :key="item.name" class="group-bd">
            <view :class="['item', 'border-bottom', item.open ? '' : 'item-close']" @click="toggleClick(index, item.path)">
                <image class="item-logo" :src="item.icon" />
                <text class="item-desc">{{item.name}}</text>
                <image class="item-logo item-toggle" src="../../common/img/goto.png" if="item.path" />
                <image class="item-logo item-toggle" src="../../common/img/close.png" else-if="item.open" />
                <image class="item-logo item-toggle" src="../../common/img/open.png" else />
            </view>
            <view if="item.open">
                <view class="sub-item border-bottom" for="subItem in item.list" :key="subItem.subName" @click="oneItemClick(subItem.path)">
                    <text class="sub-item-desc">{{subItem.subName}}</text>
                    <image class="item-logo sub-item-goto" src="../../common/img/goto.png"></image>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
export default {
    config: {
        navigationBarTitleText: 'OKAM 开发框架示例',
        onReachBottomDistance: 30
    },
    hasRequest: false,
    data: {
        flag: true,
        height: 100,
        items: [
            {
                icon: require('../../common/img/api.png'),
                name: 'API',
                path: 'api/index'
            },
            {
                icon: require('../../common/img/ui.png'),
                name: '基础组件',
                path: 'components/index'
            },
            {
                icon: require('../../common/img/js.png'),
                name: '语言',
                open: false,
                list: [
                    {
                        subName: 'typescript',
                        path: 'typescript/ts'
                    }
                ]
            },
            {
                name: '模板',
                icon: require('../../common/img/template.png'),
                open: false,
                list: [
                    {
                        subName: '模板语法',
                        path: 'tpl/tplSyntax'
                    },
                    {
                        subName: '模板复用',
                        path: 'tpl/tplReuse'
                    },
                    {
                        subName: 'ref 属性支持',
                        path: 'tpl/ref'
                    },
                    {
                        subName: 'filter 支持',
                        path: 'filter/index'
                    },
                    {
                        subName: '其他模板引擎',
                        path: 'tpl/tplPug'
                    },
                    {
                        subName: 'v- 前缀支持',
                        path: 'tpl/vueSyntax'
                    },
                    {
                        subName: 'template引用',
                        path: 'tpl/template'
                    }
                ]
            },
            {
                name: '组件',
                icon: require('../../common/img/component.png'),
                open: false,
                list: [
                    {
                        subName: '自定义组件',
                        path: 'component/componentPage',
                    },
                    {
                        subName: 'Canvas组件',
                        path: 'component/canvas'
                    },
                    {
                        subName: '生命周期',
                        path: 'lifecycle/index',
                    },
                    {
                        subName: 'Behavior支持',
                        path: 'behavior/index',
                    },
                    {
                        subName: '广播支持',
                        path: 'broadcast/index',
                    }
                ]
            },
            {
                name: '数据操作',
                icon: require('../../common/img/data.png'),
                open: false,
                list: [
                    {
                        subName: '使用 function 初始化',
                        path: 'data/init',
                    },
                    {
                        subName: '数组操作',
                        path: 'data/array',
                    },
                    {
                        subName: '计算属性',
                        path: 'data/computed',
                    },
                    {
                        subName: 'watch属性',
                        path: 'data/watch',
                    },
                    {
                        subName: 'watchbug属性',
                        path: 'data/watchparent',
                    },
                    {
                        subName: 'redux状态管理',
                        path: 'todos/todoList'
                    },
                    {
                        subName: 'v-model属性',
                        path: 'data/model',
                    },
                    {
                        subName: 'v-html 支持',
                        path: 'data/vhtml'
                    }
                ]
            },
            {
                name: '性能相关',
                icon: require('../../common/img/performance.png'),
                open: false,
                list: [
                    {
                        subName: '生命周期onInit',
                        path: 'performance/oninit'
                    }
                ]
            },
            {
                icon: require('../../common/img/more.png'),
                name: '其他',
                open: false,
                list: [
                    {
                        subName: '单文件引入',
                        path: 'sfc/index'
                    },
                    {
                        subName: '单文件分开引入',
                        path: 'sfc/separate'
                    },
                    {
                        subName: '页面事件处理函数',
                        path: 'page-event/index'
                    },
                    {
                        subName: '页面栈getCurrentPages',
                        path: 'page-stack/index'
                    },
                    {
                        subName: '样式单位转换',
                        path: 'design-width/index'
                    }
                ]
            }
        ],
        isInit: false,
        setDataInit: false
    },
    methods: {
        oneItemClick(viewPath) {
            console.log('onitemclick api', this.$api);
            this.$api.navigateTo({
                url: '/pages/' + viewPath
            });
        },

        toggleClick(index, navPath) {
            console.log('toggleClick api', this.$api);
            // 无子项直接跳转
            if (navPath) {
                this.$api.navigateTo({
                    url: '/pages/' + navPath
                });
                return;
            }

            // 子项展开与收起
            let items = this.items;
            let upItem = items[index];
            // this.setData(`items[${index}].open`, !items[index].open)
            items.splice(index, 1, Object.assign(upItem, {open: !upItem.open}));
            // this.items.getItem(index).open = !items[index].open;
        },

        getData() {
            // return new Promise((resolve, reject) => {
            //     swan.request({
            //         url: 'xxx',
            //         success: res => resolve(res)
            //     });
            // });
        }
    },
    mounted() {
        getApp().globalData.isHome = true;
        console.log('[home page] mounted.....getApp>>>>>>', getApp().globalData);
    },
    onInit(query) {
        console.log('[home page] onInit......this.$http', this.$http);
        if (!this.hasRequest) {
            this.hasRequest = true;
            this.isInit = true;
        }
    },
    beforeCreate(param) {
        console.log('[home page] beforeCreate....');
    },
    onShow(option) {
        console.log('[home page] getCurrentPages>>>>>>!!', getCurrentPages());
    },
    created(param) {
        console.log('[home page] created....');
    },
    onLoad() {
        console.log('[home page] onload.............this.$http', this.$http);
    },
    onHide() {
        console.log('[home page] onHide....');
    },
    destroyed() {
        console.log('[home page] destroyed....');
    },
    onUnload() {
        console.log('[home page] onUnload....');
    },
    onReachBottom(e) {
        console.log('[home page] onReachBottom...');
    },
    onPageScroll(e) {
        console.log('[home page] onPageScroll...', e);
    },
    onPullDownRefresh() {
        // console.log('home page onPullDownRefresh...');
    },
    onShareAppMessage() {
        // console.log('home page onShareAppMessage...');
    },
    onTabItemTap(item) {
        // console.log('home page onTabItemTap....');
        console.log(item.index);
        console.log(item.pagePath);
        console.log(item.text);
    },
    onURLQueryChange({newURLQuery, oldURLQuery}) {
        console.log(newURLQuery, oldURLQuery); //  输出结果为 {channel: 'movie'} {}
    }
};
</script>
<style lang="stylus">
.group
    font-size: 14px
    border: 1px solid #ccc; /* no */

.group-hd
    height: 150px
    padding: 0 15px 0
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    background-color: #fff

.group-logo
    width: 50px
    height: @width

.item-logo
    width: 30px
    height: @width

.group-desc
    text-align: center
    color: #999
    margin-top: 20px
    line-height: 1.6
    font-size: 16px

.group-bd
    border-top: 7px solid #f5f5f5
    background: #fff

.group-bd
    &:last-child
        border-bottom: 7px solid #f5f5f5

.item
    padding: 10px 5px 10px
    position: relative
    display: flex
    align-items: center

.item-close
    &:after
        height: 0

.item-logo
    display: inline-block

.item-desc
    font-size: 16px
    margin-left: 20px

.item-toggle
    position: absolute
    right: 10px

.sub-item
    position: relative
    margin-left: 15px
    padding: 10px 0
    display: flex
    align-items: center

.sub-item
    &:last-child
        &:after
            height: 0

.sub-item-goto
    position: absolute
    right: 10px

.sub-item-desc
    color: #666

.area
    height: 100px
</style>
