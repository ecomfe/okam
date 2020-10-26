<template>
    <view class="tabbar-api-wrap">
        <view class="row"><button @click="onShowTabBarRedDot">ShowTabBarRedDot</button></view>
        <view class="row"><button @click="onHideTabBarRedDot">HideTabBarRedDot</button></view>
        <view class="row"><button @click="onShowTabBar">ShowTabBar</button></view>
        <view class="row"><button @click="onHideTabBar">HideTabBar</button></view>
        <view class="row"><button @click="onSetTabBarStyle">SetTabBarStyle</button></view>
        <view class="row"><button @click="onSetTabBarItem">SetTabBarItem</button></view>
        <view class="row"><button @click="onSetTabBarBadge">SetTabBarBadge</button></view>
        <view class="row"><button @click="onRemoveTabBarBadge">RemoveTabBarBadge</button></view>
    </view>
</template>
<script>
export default {
    config: {
        title: 'TabBar'
    },

    data: {
    },

    methods: {
        onShowTabBarRedDot() {
            this.$api.showTabBarRedDot({
                index: 1,
                success(res) {
                    console.log('showTabBarRedDot ok', res);
                }
            });
        },

        onHideTabBarRedDot() {
            this.$api.hideTabBarRedDot({
                index: 1,
                success(res) {
                    console.log('hideTabBarRedDot ok', res);
                }
            });
        },

        onShowTabBar() {
            this.$api.showTabBar({
                animation: true,
                success(res) {
                    console.log('showTabBar ok', res);
                }
            });
        },

        onHideTabBar() {
            this.$api.hideTabBar({
                animation: true,
                success(res) {
                    console.log('hideTabBar ok', res);
                }
            });
        },

        onSetTabBarStyle() {
            this.$api.setTabBarStyle({
                color: '#3f51b5',
                selectedColor: '#795548',
                backgroundColor: '#d2d2da',
                borderStyle: 'white',
                success(res) {
                    console.log('setTabBarStyle ok', res);
                }
            });
        },

        onSetTabBarItem() {
            this.$api.setTabBarItem({
                index: 0,
                text: 'hello',
                // 小程序下，不能为相对路径，必须是相对根的路径：common/img/js.png
                iconPath: require('../../common/img/js.png'),
                selectedIconPath: require('../../common/img/template.png'),
                success(res) {
                    console.log('setTabBarItem ok', res);
                }
            });
        },

        onSetTabBarBadge() {
            this.$api.setTabBarBadge({
                index: 2,
                text: '23645',
                success(res) {
                    console.log('setTabBarBadge ok', res);
                }
            });
        },

        onRemoveTabBarBadge() {
            this.$api.removeTabBarBadge({
                index: 2,
                success(res) {
                    console.log('removeTabBarBadge ok', res);
                }
            });
        }
    },
    created() {
        console.log('[tab page] created......');
    },
    onShow() {
        console.log('[tab page] onShow......', getCurrentPages());
    }
};
</script>
<style lang="stylus">
.tabbar-api-wrap
    padding: 20px
    background: #fff

    .row
        margin: 20px 0
</style>
