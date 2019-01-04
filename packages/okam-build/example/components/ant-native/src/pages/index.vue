<template>
    <view class="native-page">
         <view class="title">Native 组件</view>
         <add-button @click="handleClick"></add-button>
         <view class="canvase-container">
            <canvas
                id="area"
                @touchstart="touchStart"
                @touchmove="touchMove"
                @touchend="touchEnd"
                :width="width" :height="height"
            />
        </view>
        <view>
            <list>
                <view slot="header">列表头部</view>
                <block for="item in items">
                    <list-item
                    :key="'item' + index"
                    :index="index"
                    @click="handleListClick(item)"
                    :last="index === (items.length - 1)"
                    >
                    {{item.title}}
                    <view class="am-list-brief">{{item.brief}}</view>
                    </list-item>
                </block>
                <view slot="footer">列表尾部</view>
            </list>
        </view>
    </view>
</template>

<script>
import AddButton from '../components/add-button/add-button';
import List from 'mini-ddui/es/list/index';
import ListItem from 'mini-ddui/es/list/list-item/index';
import F2 from '@antv/my-f2';
// import F2 from '@antv/my-f2/lib/core';
// import '@antv/f2/lib/geom/line';
// const Tooltip = require('@antv/f2/lib/plugin/tooltip'); // 引入 tooltip 插件

let chart = null;

function drawChart(canvas, width, height) {
    const data = [
        {value: 63.4, city: 'New York', date: '2011-10-01'},
        {value: 62.7, city: 'Alaska', date: '2011-10-01'},
        {value: 72.2, city: 'Austin', date: '2011-10-01'},
        {value: 58, city: 'New York', date: '2011-10-02'},
        {value: 59.9, city: 'Alaska', date: '2011-10-02'},
        {value: 67.7, city: 'Austin', date: '2011-10-02'},
        {value: 53.3, city: 'New York', date: '2011-10-03'},
        {value: 59.1, city: 'Alaska', date: '2011-10-03'},
        {value: 69.4, city: 'Austin', date: '2011-10-03'},
        // ...
    ];
    chart = new F2.Chart({
        el: canvas,
        width,
        height
    });

    chart.source(data, {
        date: {
            range: [0, 1],
            type: 'timeCat',
            mask: 'MM-DD'
        },
        value: {
            max: 300,
            tickCount: 4
        }
    });
    chart.axis('date', {
        label(text, index, total) {
            const textCfg = {};
            if (index === 0) {
                textCfg.textAlign = 'left';
            }
            if (index === total - 1) {
                textCfg.textAlign = 'right';
            }
            return textCfg;
        }
    });
    chart.area().position('date*value').color('city').adjust('stack');
    chart.line().position('date*value').color('city').adjust('stack');
    chart.render();
    return chart;
}

export default {
    config: {
        title: 'Native 组件支持'
    },

    components: {
        AddButton,
        List,
        ListItem
    },

    data: {
        width: 0,
        height: 0,
        items: [
            {
                title: '双行列表',
                brief: '描述信息',
                arrow: true
            },
            {
                title: '双行列表',
                brief: '描述信息',
                arrow: true
            },
            {
                title: '双行列表',
                brief: '描述信息',
                arrow: true
            }
        ]
    },

    mounted() {
        this.createSelectorQuery()
            .select('#area')
            .boundingClientRect()
            .exec((res) => {
                // 获取分辨率
                const pixelRatio = this.$api.getSystemInfoSync().pixelRatio;
                // 获取画布实际宽高
                const canvasWidth = res[0].width;
                const canvasHeight = res[0].height;
                // 高清解决方案
                this.width = canvasWidth * pixelRatio;
                this.height = canvasHeight * pixelRatio;
                console.log(pixelRatio, 'width', this.width, this.height)

                const myCtx = this.$api.createCanvasContext('area');
                myCtx.scale(pixelRatio, pixelRatio); // 必要！按照设置的分辨率进行放大
                const canvas = new F2.Renderer(myCtx);
                this.canvas = canvas;
                //console.log(res[0].width, res[0].height);
                drawChart(canvas, res[0].width, res[0].height);
            });
    },

    methods: {
        handleListClick(e) {
            console.log('list click...', e);
        },

        handleClick(e) {
            console.log('click', e.detail);
        },

        touchStart(e) {
            console.log('touch start...', e)
            if (this.canvas) {
                this.canvas.emitEvent('touchstart', [e]);
            }
        },

        touchMove(e) {
            console.log('touch move...', e)
            if (this.canvas) {
                this.canvas.emitEvent('touchmove', [e]);
            }
        },

        touchEnd(e) {
            console.log('touch end...', e)
            if (this.canvas) {
                this.canvas.emitEvent('touchend', [e]);
            }
        }
    }
};
</script>

<style lang="css">

.native-page {
    height: 100vh;
    width: 100vw;
}

.title {
    display: block;
    width: 100%;
    color: #f00;
    font-size: 20px;
    text-align: center;
}

.canvase-container {
    height: 600px;
    width: 100%
}
canvas {
  width: 100%;
  height: 100%;
}
</style>
