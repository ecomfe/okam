/**
 * @file BehaviorA
 * @author xxx
 */

// import behvaiorB from './behaviorB';
import util from './util';

export default {
    props: {
        title: {
            type: String,
            default: 'Hell Title'
        }
    },

    data: {
        a: 3,
        b: {
            c: 6
        }
    },

    computed: {
        myBehaviorComputed() {
            console.log('behaviorA myBehaviorComputed called...');
            return this.a + 22;
        },
        myComputedNum() {
            console.log('behaviorA myComputedNum called...');
            return this.a + 66;
        }
    },

    created() {
        console.log('call behvaiorA created...', this);
    },

    beforeMount() {
        console.log('call behvaiorA before mount...', this);
    },

    methods: {
        methodA() {
            console.log('call behvaiorA methodA...', this);
        },
        methodC() {
            console.log('call behvaiorA methodC...', this);
        }
    }
};
