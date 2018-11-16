/**
 * @file Props initialization helper
 * @author sparklewhy@gmail.com
 */

'use strict';

/**
 * Initialize the props to add observer to the prop to listen the prop change.
 */
export default function initProps() {
    let props = this.props;
    Object.keys(props).forEach(p => {
        let value = props[p];
        let rawObserver = value.observer;
        value.observer = function (newVal, oldVal, changePath) {
            rawObserver && rawObserver.call(this, newVal, oldVal, changePath);
            let propObserver = this.__propsObserver;
            propObserver && propObserver.firePropValueChange(p, newVal, oldVal);
        };
    });
}
