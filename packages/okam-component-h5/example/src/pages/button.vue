<template>
    <div class="okam-demo-container">
        <o-button @click="clickFn">Default button</o-button>
        <o-button size="default">Default size button</o-button>
        <o-button size="mini">Mini button</o-button>
        <o-button type="primary">Primary button</o-button>
        <o-button type="primary" disabled>Disabled primary button</o-button>
        <o-button type="default">Default type button</o-button>
        <o-button type="warn">Warn type button</o-button>
        <o-button type="warn" disabled>Disabled warn button</o-button>
        <o-button plain>Plain button</o-button>
        <o-button disabled>Disabled button</o-button>
        <o-button disabled loading>Loading button</o-button>
        <o-button hover-class="none">None hover button</o-button>
    </div>
</template>

<script>
import OButton from 'okam/Button';
export default {
    components: {
        OButton
    },
    methods: {
        clickFn() {
            console.log('default click');
        }
    }
};
</script>

<style lang="stylus">
.okam-demo-container
    padding 15px 17px 15px
    button
        margin-bottom 5px
</style>