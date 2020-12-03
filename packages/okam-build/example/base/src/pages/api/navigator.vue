<template>
    <div class="navigator-wrapper">
        <div class="navigate">
            <button type="primary" @click="navigate('to')">跳转新页面</button>
        </div>
        <div class="back">
            <button type="primary" @click="navigate('back')">返回上一页</button>
        </div>
        <div class="redirect">
            <button type="primary" @click="navigate('redirect')">在当前页面打开</button>
        </div>
        <div class="switch-tab">
            <button type="primary" @click="navigate('switch')">跳转到首页标签页</button>
        </div>
        <div class="re-launch">
            <button type="primary" @click="navigate('reLaunch')">关闭所有跳转到首页</button>
        </div>
    </div>
</template>

<script>
export default {
    config: {
        title: '页面跳转'
    },

    data() {
        return {
        }
    },

    methods: {
        navigate(action = '') {
            switch(action) {
                case 'to':
                    this.$api.navigateTo({
                        url: '/pages/home/index',
                        success() {
                            console.log('navigateTo', 'success')
                        }
                    });
                    break;
                case 'back':
                    this.$api.navigateBack();
                    break;
                case 'redirect':
                    this.$api.redirectTo({
                        url: '/pages/home/index',
                        success() {
                            console.log('redirectTo', 'success')
                        }
                    });
                    break;
                case 'switch':
                    this.$api.switchTab({
                        url: '/pages/home/index',
                        success() {
                            console.log('redirectTo', 'success')
                        }
                    });
                    break;
                case 'reLaunch':
                    this.$api.reLaunch({
                        url: '/pages/home/index',
                        success() {
                            console.log('reLaunch', 'success')
                        }
                    });
                    break;
            }
        }
    }
};
</script>
<style lang="stylus" scoped>
.navigator-wrapper
    margin 20px
    button
        margin-top 10px
</style>
