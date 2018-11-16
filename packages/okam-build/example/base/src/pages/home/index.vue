<template>
    <view class="group">
        <view class="group-hd">
            <image class="group-logo" src="../../common/img/logo.png"></image>
            <view class="group-desc">以下将展示小程序开发框架能力</view>
        </view>

        <view for="item, index in items" :key="item.name" class="group-bd">
            <view class="item border-bottom {{item.open ? '' : 'item-close'}}" @click="toggleClick" data-index="{{index}}" data-path="{{item.path}}">
                <image class="item-logo" :src="item.icon"></image>
                <text class="item-desc">{{item.name}}</text>
                <image if="item.path" class="item-logo item-toggle" src="../../common/img/goto.png"></image>
                <image else class="item-logo item-toggle" :src="item.open ? '../../common/img/close.png' : '../../common/img/open.png'"></image>
            </view>
            <view if="item.open">
                <view class="sub-item border-bottom" for="subItem in item.list" :key="subItem.subName" @click="oneItemClick" data-path="{{subItem.path}}">
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
        navigationBarTitleText: 'OKAM 开发框架示例'
    },

    data: {
        items: [
            {
                icon: '../../common/img/js.png',
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
                icon: '../../common/img/template.png',
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
                        subName: '其他模板引擎',
                        path: 'tpl/tplPug'
                    }
                ]
            },
            {
                name: '组件',
                icon: '../../common/img/component.png',
                open: false,
                list: [
                    {
                        subName: '自定义组件',
                        path: 'component/componentPage',
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
                icon: '../../common/img/data.png',
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
                        subName: 'redux状态管理',
                        path: 'todos/todoList'
                    }
                ]
            }
        ]
    },

    methods: {

        oneItemClick(e) {
            let viewPath = e.currentTarget.dataset.path;
            this.$api.navigateTo({
                url: '/pages/' + viewPath
            });
        },

        toggleClick(e) {
            // 无子项直接跳转
            let navPath = e.currentTarget.dataset.path;
            if (navPath) {
                this.$api.navigateTo({
                    url: '/pages/' + navPath
                });
                return;
            }

            // 子项展开与收起
            let items = this.data.items;
            let index = e.currentTarget.dataset.index;
            // this.setData(`items[${index}].open`, !items[index].open)
            this.items.getItem(index).open = !items[index].open;
        }
    }
};
</script>
<style lang="stylus">
.group
    font-size: 14px

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
</style>
