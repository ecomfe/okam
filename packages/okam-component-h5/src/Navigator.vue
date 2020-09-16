<template>
    <a
        href="javascript:;"
        :class="classNames"
        @click="onClick"
    >
        <slot></slot>
    </a>
</template>
<script>
import getHoverMixin from './mixins/hover';
import router from 'okam-api-h5/src/router';

export default {
    mixins: [getHoverMixin({
        defaultHoverClass: 'okam-navigator-hover',
        defaultHoverStartTime: 50,
        defaultHoverStayTime: 60
    })],

    props: {
        url: String,
        openType: {
            type: String,
            default: 'navigate'
        },
        delta: Number
    },

    computed: {
        classNames() {
            let clazz = this.getHoverClass() || '';
            if (clazz) {
                clazz += ' ';
            }
            clazz += 'okam-navigator';
            return clazz;
        }
    },

    mounted() {
        router._initRouterInstance(this.$router);
    },

    methods: {
        onClick(e) {
            switch (this.openType) {
                case 'navigate':
                    router.navigateTo({url: this.url});
                    break;
                case 'redirect':
                    router.redirectTo({url: this.url});
                    break;
                case 'switchTab':
                    router.switchTab({url: this.url});
                    break;
                // case 'reLaunch':
                //     break;
                case 'navigateBack':
                    let delta = this.delta;
                    let opts;
                    delta && (opts = {delta});
                    router.navigateBack(opts);
                    break;
                default:
                    break;
            }

            this.$emit('click', e);
        }
    }
};
</script>
<style>
.okam-navigator {
    text-decoration: none;
    display: block;
}
.okam-navigator-hover {
    background-color: rgba(0, 0, 0, 0.1);
    opacity: 0.7;
}
</style>
