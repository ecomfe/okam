/**
 * @file Store
 * @author xxx
 */

import Vuex from 'vuex';

export default new Vuex.Store({
    state: {
        count: 0,
        obj: {
            a: 1
        },
        arr: []
    },
    mutations: {
        increment: state => state.count++,
        decrement: state => state.count--,
        changeObj(state) {
            state.obj.a = 2;
        },
        upArr(state) {
            state.arr.push(2);
        }
    },
    actions: {
        incrementAction({commit}) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    commit('increment');
                    resolve();
                });
            });
        },
        addTwiceAction({dispatch, commit}) {
            return dispatch('incrementAction').then(() => {
                commit('increment');
            });
        }
    }
});
