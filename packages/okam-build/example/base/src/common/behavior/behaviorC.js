/**
 * @file BehaviorC
 * @author xxx
 */

export default {
    data: {
        b: {
            c: 56
        },
        dc: 666
    },

    created() {
        console.log('call behvaiorC created...');
    },

    beforeMount() {
        console.log('call behvaiorC mount...');
    },

    methods: {
        methodB() {
            console.log('call behvaiorC methodB...');
        }
    }
};
