/**
 * @file Ant Component base
 * @author sparklewhy@gmail.com
 */

'use strict';

import componentBase from '../../base/component';

const antComponent = Object.assign({}, componentBase, {
    didMount() {
        this.created();
        this.attached();
        this.ready();
    },

    didUpdate() {
        this.beforeUpdate && this.beforeUpdate();
        this.updated && this.updated();
    },

    didUnmount() {
        this.detached();
    }
});

antComponent.methods = Object.assign({}, antComponent.methods, {

    /**
     * Emit custom component event
     *
     * @param {...any} args the event arguments
     */
    $emit(...args) {
        this.__beforeEmit && this.__beforeEmit(args);
        this.$listener.emit.apply(this.$listener, args);

        let eventProp = args[0];
        eventProp = 'on' + eventProp.charAt(0).toUpperCase() + eventProp.substr(1);
        let eventHandler = this.props[eventProp];
        eventHandler.call(this, args[1]);
    }
});

export default antComponent;
