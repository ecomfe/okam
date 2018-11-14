/**
 * @file Add button component
 * @author xxx@baidu.com
 */

/* eslint-disable babel/new-cap */
/* global Component:false */

Component({
    props: {
        onClickMe: () => {
            console.log('hello... click me.');
        }
    },

    data: {
        hi: 'Add btn'
    },

    methods: {
        onClickMe() {
            this.props.onClick('haha');
        }
    }
});
