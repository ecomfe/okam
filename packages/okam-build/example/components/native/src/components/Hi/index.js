/**
 * @file Hi component
 * @author xxx
 */

/* global Component:false */
/* eslint-disable babel/new-cap */

Component({
    data: {
        title: 'Hi Native Component'
    },

    methods: {
        handleTap() {
            console.log('click me...');
            this.triggerEvent('hi', 'hi');
        }
    }
});
