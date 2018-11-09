<template>
    <view class="broadcast-page">
        <broadcast-component></broadcast-component>
        <button @click="handleClick">broadcast Page</button>
    </view>
</template>

<script>
import BroadcastComponent from '../../components/BroadcastComponent';

export default {
    config: {
        title: '广播支持'
    },

    components: {
        BroadcastComponent
    },

    data: {
    },

    broadcastEvents: {
        'broadcastEventA': function (e) {
            console.log('receive broadcast event a in page...', e, this);
        },

        'broadcastEventB.once': function (e) {
            console.log('receive broadcast event B in page...', e, this);
        }
    },

    methods: {
        handleClick() {
            this.$broadcast('broadcastEventC', {message: 'jj'});
        }
    }
};
</script>

<style lang="stylus">

</style>
