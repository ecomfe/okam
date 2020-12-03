<template>
    <div class="api-phone-wrapper">
        <button @click="handleMakePhoneCallClick">Call {{ this.phoneNumber }}</button>
    </div>
</template>
<script>
export default {
    config: {
        title: 'PhoneAPI'
    },

    data () {
        return {
            phoneNumber: 10010
        }
    },

    methods: {
        handleMakePhoneCallClick () {
            this.$api.makePhoneCall({
                phoneNumber: this.phoneNumber,
                success: () => {
                    console.log('success')
                }
            });
        }
    }
};
</script>
<style lang="stylus">
.api-phone-wrapper
    padding: 20px
    background: #fff
</style>
