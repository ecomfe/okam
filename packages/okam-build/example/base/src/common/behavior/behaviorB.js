/**
 * @file BehaviorB
 * @author xxx
 */

import behaviorC from './behaviorC';
import behaviorD from './behaviorD';

export default {
    mixins: [behaviorC, behaviorD],

    props: {
        title: {
            type: String,
            default: 'Hell TitleB'
        },
        subTitle: String
    },

    data: {
        a: 13,
        b: {
            c: 26,
            k: 555
        },
        d: 666
    },

    created() {
        console.log('call behvaiorB created...', this);
    },

    beforeMount() {
        console.log('call behvaiorB mount...', this);
    },

    methods: {
        methodA() {
            console.log('call behvaiorB methodA...', this);
        },

        methodB() {
            console.log('call behvaiorB methodB...', this);
        }
    }
};
