/**
 * @file BehaviorD
 * @author xxx
 */

export default {
    data: {
        b: {
            c: 96
        },
        dd: 866
    },

    created() {
        console.log('call behvaiorD created...');
    },

    beforeMount() {
        console.log('call behvaiorD mount...');
    },

    methods: {
        methodB() {
            console.log('call behvaiorD methodB...');
        }
    }
};
