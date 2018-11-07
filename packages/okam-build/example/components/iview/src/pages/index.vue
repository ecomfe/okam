<template>
    <view class="comp-page">
        <view class="title">iView Weapp</view>
        <i-button @click="handleClick">默认按钮</i-button>
        <i-button @click="handleClick" type="error" long="true">联通两边按钮</i-button>
        <i-row>
            <i-col span="8" i-class="col-class">col-8</i-col>
            <i-col span="8" i-class="col-class">col-8</i-col>
            <i-col span="8" i-class="col-class">col-8</i-col>
        </i-row>

        <!-- <i-grid>
            <i-grid-item>
                <i-grid-icon>
                    <image src="https://file.iviewui.com/icon/iview.png" />
                </i-grid-icon>
                <i-grid-label>Grid</i-grid-label>
            </i-grid-item>
            <i-grid-item>Grid</i-grid-item>
            <i-grid-item>Grid</i-grid-item>
        </i-grid> -->

        <i-panel title="标题">
            <view style="padding: 15px;">PANEL 内容区域</view>
        </i-panel>

        <i-card title="卡片标题" extra="额外内容" thumb="https://i.loli.net/2017/08/21/599a521472424.jpg">
            <view slot="content">内容不错</view>
            <view slot="footer">尾部内容</view>
        </i-card>

        <i-icon type="activity" size="28" color="#80848f" />


        <!-- <i-tabs current="{{ current }}" @change="handleChange">
            <i-tab key="tab1" title="选项1"></i-tab>
            <i-tab key="tab2" title="选项2"></i-tab>
            <i-tab key="tab3" title="选项3"></i-tab>
        </i-tabs> -->

        <i-panel title="基础用法">
            <view style="padding: 16px">
                <i-input-number value="{{ value1 }}" min="0" max="100" bindchange="handleChange1" />
            </view>
        </i-panel>
    </view>
</template>

<script>


import IButton from 'iview-weapp/dist/button/index';
import IRow from 'iview-weapp/dist/row/index';
import ICol from 'iview-weapp/dist/col/index';

// import iGrid from 'iview-weapp/dist/grid/index';
// import iGridItem from 'iview-weapp/dist/grid-item/index';
// import iGridIcon from 'iview-weapp/dist/grid-icon/index';
// import iGridLabel from 'iview-weapp/dist/grid-label/index';


import IPanel from 'iview-weapp/dist/panel/index';

import ICard from 'iview-weapp/dist/card/index';

import IIcon from 'iview-weapp/dist/icon/index';


// import ITabs from 'iview-weapp/dist/tabs/index';
// import ITab from 'iview-weapp/dist/tab/index';


import IInputNumber from 'iview-weapp/dist/input-number/index';

export default {
    config: {
        title: 'iView Weapp 支持'
    },

    components: {
        // ITabs,
        // ITab,
        IIcon,
        ICard,
        // IGrid,
        // IGridItem,
        // IGridIcon,
        // IGridLabel,
        IInputNumber,
        IPanel,
        IButton,
        IRow,
        ICol
    },

    data: {
        value1: 1,
        value2: 0.1,
        current: 'tab1',
        current_scroll: 'tab1',
        testData: true
    },

    methods: {
        handleClick() {
            console.log(1);
        },
        handleChange (detail) {
            this.setData({
                current: detail.key
            });
        },

        handleChangeScroll (detail) {
            this.setData({
                current_scroll: detail.key
            });
        },

        handleChange1 (detail) {
            this.setData({
                value1: detail.value
            });
        },

        handleChange2 (detail) {
            this.setData({
                value2: detail.value
            });
        }
    }
};
</script>

<style lang="css">
.title {
    display: block;
    width: 100%;
    color: #f00;
    font-size: 20px;
    text-align: center;
}

</style>
