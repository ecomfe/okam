/**
 * @file The swan observable plugin for test
 * @author sparklewhy@gmail.com
 */

'use strict';

import antComponent from 'core/ant/base/component';

export function fakeAntArrayAPIs() {
    const componentFakeMethods = [
        '$spliceData'
    ];
    const rawComponentMethods = [];
    componentFakeMethods.forEach(
        m => rawComponentMethods.push(antComponent[m])
    );

    componentFakeMethods.forEach(
        m => {
            antComponent[m] = (...args) => {
                let callback = args[args.length - 1];
                if (typeof callback === 'function') {
                    setTimeout(() => callback(), 0);
                }
            };
        }
    );

    return () => {
        componentFakeMethods.forEach(
            (m, idx) => (antComponent[m] = rawComponentMethods[idx])
        );
    };
}
