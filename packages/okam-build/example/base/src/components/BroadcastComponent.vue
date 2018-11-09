<template>
    <view class="broadcast-component-wrap">
        {{text}}
        <button @click="handleClick">Send broadcast event</button>
    </view>
</template>
<script>

export default {
    data: {
        text: 'broadcast component'
    },

    broadcastEvents: {
        'broadcastEventC': function (e) {
            console.log('receive broadcast event c in component...', e, this);
        },
        'broadcastEventB': function (e) {
            console.log('receive broadcast event b in component...', e, this);
        }
    },

    methods: {
        handleClick() {
            this.$broadcast('broadcastEventB', {message: 'from component'});
            this.$broadcast('broadcastEventB', {message: 'from component again'});
        }
    }
}
</script>
<style lang="stylus">
.broadcast-component-wrap
    padding: 20px
    margin: 20px
    border: 1px solid #ccc
    background: #fff
</style>
