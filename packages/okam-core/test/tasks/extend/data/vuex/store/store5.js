/**
 * @file Store
 * @author xxx
 */

import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    count: 0
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
    increment(state) {
        state.count++;
    },
    decrement(state) {
        state.count--;
    }
};

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
    increment: ({commit}) => commit('increment'),
    decrement: ({commit}) => commit('decrement'),
    incrementIfOdd({commit, state}) {
        if ((state.count + 1) % 2 === 0) {
            commit('increment');
        }
    },
    incrementAsync({commit}) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('increment');
                resolve();
            }, 10);
        });
    }
};

// getters are functions
const getters = {
    evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd'
};

const countModule = {
    namespaced: true,
    state: {
        count: -99,
        obj: {a: 2}
    },
    getters: {
        evenOrOdd: state => state.count % 2 === 0 ? 'even' : 'odd',
        a: state => state.obj.a
    },
    mutations: {
        increment: state => state.count++,
        add: state => state.obj.a++
    }
};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
        countModule
    },
    plugins: [createLogger()]
});
