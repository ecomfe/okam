/**
 * @file Data observable test case
 * @author sparklewhy@gmail.com
 */

'use strict';

import observable from 'core/extend/data/observable';
import assert from 'assert';

describe('Observable Data', () => {
    it('should observable for object data', () => {
        let extension = observable.component;
        let component = Object.assign({
            setData() {}
        }, extension, {
            data: {
                givenName: 'Jack',
                familyName: 'Lin'
            },

            computed: {
                fullName() {
                    return this.givenName + ' ' + this.familyName;
                }
            }
        }, extension.methods);

        extension.$init.call(component);
        extension.created.call(component);

        assert(component.givenName === component.data.givenName);
        assert(component.fullName === component.givenName + ' ' + component.familyName);
    });
});
