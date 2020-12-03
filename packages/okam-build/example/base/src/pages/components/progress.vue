<template>
    <view class="progress-component-wrap">
        <progress class="progress-bar" :percent="percent" borderRadius="10" fontSize="14" strokeWidth="12" show-info />
        <progress class="progress-bar" :percent="percent" backgroundColor="#000" strokeWidth="12" />
        <progress class="progress-bar" :percent="percent" active activeMode="forwards"  @activeend="onActiveEnd2" activeColor="pink"/>
        <progress class="progress-bar" :percent="percent" active/>
        <button @click="addPercent">增加 percent</button>
        <button @click="minusPercent">减少 percent</button>
    </view>
</template>
<script>
export default {
    config: {
        title: 'Progress Component'
    },

    data: {
        percent: 10
    },

    methods: {
        onActiveEnd(e) {
            console.log('active end...', e);
        },

        onActiveEnd2(e) {
            console.log('active end2...', e);
        },

        addPercent() {
            this.percent += 10;
        },

        minusPercent() {
            this.percent -= 10;
        }
    }
};
</script>
<style lang="stylus">
.progress-component-wrap
    padding: 20px
    background: #fff
    .progress-bar
        margin: 10px 0
</style>
