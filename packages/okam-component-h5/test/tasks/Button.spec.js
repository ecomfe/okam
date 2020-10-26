/**
 * @file Button test spec
 * @author sparklewhy@gmail.com
 */

import {shallowMount} from '@vue/test-utils';
import Button from '@/Button';

describe('Button', () => {
    it('should support set button text', () => {
        const wrapper = shallowMount(Button, {
            slots: {
                default: 'my-btn'
            }
        });
        expect(wrapper.text()).toEqual('my-btn');
    });
});
