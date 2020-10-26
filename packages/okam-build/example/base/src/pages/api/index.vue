<template>
    <view class="api-home-wrap">
        <view class="banner">
            <image class="banner-logo" src="../../common/img/okam.png"></image>
            <text class="banner-desc">Okam 小程序开发框架 API 演示示例</text>
        </view>
        <view for="item, index in items" :key="item.name" :class="['list-group', index === items.length - 1 ? 'list-group-last' : '']">
            <view :class="['list-group-title', item.open ? '' : 'list-group-close']" @click="toggleClick(index, item.path)">
                <image class="title-icon" :src="item.icon"></image>
                <text class="title-desc">{{item.name}}</text>
                <image class="op-icon" src="../../common/img/goto.png" if="item.path" />
                <image class="op-icon" src="../../common/img/close.png" else-if="item.open" />
                <image class="op-icon" src="../../common/img/open.png" else />
            </view>
            <view class="list-group-content" if="item.open">
                <view class="content-item" for="subItem in item.list" :key="subItem.subName" @click="oneItemClick(subItem.path)">
                    <text class="content-item-desc">{{subItem.subName}}</text>
                    <image class="op-icon" src="../../common/img/goto.png"></image>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
import {api, appEnv} from 'okam';
export default {
    config: {
        title: 'OKAM 开发框架 API 示例'
    },

    data: {
        items: [
            {
                name: '界面',
                icon: require('../../common/img/ui.png'),
                open: false,
                list: [
                    {
                        subName: '设置界面标题',
                        path: 'api/navTitle'
                    },
                    {
                        subName: '交互',
                        path: 'api/interaction'
                    },
                    {
                        subName: '动画',
                        path: 'api/animation'
                    },
                    {
                        subName: '图片',
                        path: 'api/image'
                    },
                    {
                        subName: 'TabBar',
                        path: 'api/tab'
                    }
                ]
            },
            {
                name: '位置',
                icon: require('../../common/img/ui.png'),
                open: false,
                list: [
                    {
                        subName: '获取及查看位置',
                        path: 'api/location'
                    }
                ]
            },
            {
                name: '系统',
                icon: require('../../common/img/ui.png'),
                open: false,
                list: [
                    {
                        subName: '网络信息',
                        path: 'api/network'
                    },
                    {
                        subName: '剪贴板',
                        path: 'api/clipboard'
                    },
                    {
                        subName: '获取系统信息',
                        path: 'api/system'
                    },
                    {
                        subName: '打电话',
                        path: 'api/phone'
                    },
                    {
                        subName: '存储',
                        path: 'api/storage'
                    }
                ]
            },
            {
                name: '导航',
                icon: require('../../common/img/navigator.png'),
                open: false,
                list: [
                    {
                        subName: '页面导航',
                        path: 'api/navigator'
                    }
                ]
            },
            {
                name: '开放接口',
                icon: require('../../common/img/ui.png'),
                open: false,
                list: [
                    {
                        subName: '百度收银台支付',
                        path: 'api/payment'
                    }
                ]
            },
            {
                name: '其它',
                icon: require('../../common/img/ui.png'),
                open: false,
                list: [
                    {
                        subName: '窗口',
                        path: 'api/window'
                    },
                    {
                        subName: 'WebSocket',
                        path: 'api/websocket'
                    },
                    {
                        subName: 'Scroll',
                        path: 'api/scroll'
                    }
                ]
            }
        ]
    },

    methods: {

        oneItemClick(viewPath) {
            this.$api.navigateTo({
                url: '/pages/' + viewPath
            });
        },

        toggleClick(index, navPath) {
            // 无子项直接跳转
            if (navPath) {
                this.$api.navigateTo({
                    url: '/pages/' + navPath
                });
                return;
            }

            // 子项展开与收起
            let items = this.items;
            let newItem = Object.assign({}, items[index]);
            newItem.open = !newItem.open;
            this.items.splice(index, 1, newItem);
        }
    },
    onReachBottom(e) {
        console.log('>>>api/index page onReachBottom...');
    },
    onPageScroll(e) {
        console.log('>>>api/index page onPageScroll...', e);
    },
    onPullDownRefresh() {
        console.log('>>>api/index page onPullDownRefresh...');
    },
    onLoad() {
        console.log('[api page] onload......');
    },
    onShow() {
        console.log('[api page] onShow......', getCurrentPages());
    }

};
</script>
<style lang="stylus" scoped>
.api-home-wrap
    display: flex
    flex-direction: column
    font-size: 14px

.banner
    height: 150px
    padding: 0 15px 0
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    background-color: #fff

.banner-logo
    width: 80px
    height: @width

.banner-desc
    text-align: center
    color: #999
    margin-top: 20px
    line-height: 20px
    font-size: 16px

.list-group
    display: flex
    flex-direction: column
    border-top: 7px solid #f5f5f5
    background: #fff

    .op-icon
        margin-right: 10px
        width: 30px
        height: @width

.list-group-last
    border-bottom: 7px solid #f5f5f5

.list-group-title
    padding: 10px 5px 10px
    display: flex
    align-items: center

    .title-icon
        width: 30px
        height: @width

    .title-desc
        flex: 1
        margin-left: 20px
        font-size: 16px

.list-group-content
    display: flex
    flex-direction: column

    .content-item
        display: flex
        align-items: center
        margin-left: 15px
        padding: 10px 0

    .content-item-desc
        flex: 1
        color: #666
        font-size: 16px

</style>
