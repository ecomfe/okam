<template>
    <div class="component-container">
        <tab-bar :list="list" :color="color" :selectedColor="selectedColor"
            :backgroundColor="backgroundColor" :borderStyle="borderStyle"></tab-bar>
        <tab-bar :list="list"  position="top"></tab-bar>
    </div>
</template>

<script>
import TabBar from 'okam/TabBar';
export default {
    components: {
        TabBar
    },

    data() {
        return {
            color: '#2196F3',
            selectedColor: '#f44336',
            backgroundColor: '#eeecf5',
            borderStyle: 'white', // 'black',
            // position: 'bottom', // 'bottom',
            list: [
                {
                    pagePath: 'pages/home/index',
                    text: '首页',
                    iconPath: require('../common/img/data.png'),
                    selectedIconPath: require('../common/img/ui.png')
                },
                {
                    pagePath: 'pages/api/index',
                    text: 'API',
                    iconPath: require('../common/img/api.png')
                },
                {
                    pagePath: 'pages/components/index',
                    text: '组件',
                    iconPath: require('../common/img/component.png')
                }
            ]
        };
    }
};
</script>
<style lang="stylus">
.component-container
    margin: 0
</style>
