/**
 * @file redux actions
 * @author xxx
 */

/* global Component:false */
/* eslint-disable babel/new-cap */

Component({
    data: {
        title: 'Hello Native Component'
    },

    methods: {
        handleTap() {
            console.log('click me...');
            this.triggerEvent('hello', 'hi');
        }
    }
});
