<template>
    <view class="behavior-page">
        <behavior-component>
            <button @click="handleClick">Behavior Page</button>
        </behavior-component>
    </view>
</template>

<script>
import BehaviorComponent from '../../components/BehaviorComponent';
import behaviorB from '../../common/behavior/behaviorB';

export default {
    config: {
        title: 'Behavior支持'
    },

    mixins: [behaviorB],

    components: {
        BehaviorComponent
    },

    data: {
        b: {
            c: 906,
            k2: 555
        },
        e: 666
    },

    created() {
        console.log('call page created...');
    },

    methods: {
        methodA() {
            console.log('call behvaior page methodA...', this);
        },

        methodD() {
            console.log('call behvaior page methodD...', this);
        },

        handleClick() {
            console.log(this.data);
            this.methodA();
            this.methodB();
            this.methodD();
        }
    }
};
</script>

<style lang="stylus">

</style>
