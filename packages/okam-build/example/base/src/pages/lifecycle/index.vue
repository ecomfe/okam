<template>
    <view>
        <text class="title">Hello</text>
        <button for="item in 5" key="index" @click="onClickView(item)">{{item}}</button>
    </view>
</template>

<script>

export default {
    config: { // The page config defined in page.json
        navigationBarTitleText: '生命周期支持',
        backgroundColor: '#fff'
    },
    data: {
        count: 0
    },
    beforeCreate() {
        console.log('before create page...');
    },

    created() {
        console.log('create page...');
    },

    beforeMount() {
        console.log('before mount page...');
    },

    mounted() {
        console.log('mounted page...');
    },

    beforeDestroy() {
        console.log('before destroy page...');
    },

    destroyed() {
        console.log('destroyed page...');
    },
    methods: {
        onClickView(data) {
            console.log('click', data)
        }
    }
};
</script>
<style>
@import 'style/index.css';

.title {
    display: block;
    width: 100%;
    padding: 20px 0;
    text-align: center;
}

</style>
