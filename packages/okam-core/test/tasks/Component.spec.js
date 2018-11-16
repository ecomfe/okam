/**
 * @file Component test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

/* eslint-disable babel/new-cap */
/* eslint-disable fecs-min-vars-per-destructure */

import assert from 'assert';
import expect, {createSpy, spyOn} from 'expect';
import MyApp from 'core/App';
import base from 'core/base/base';
import component from 'core/base/component';
import {clearBaseCache} from 'core/helper/factory';
import EventListener from 'core/util/EventListener';
import {testCallOrder, fakeComponent, fakeAppEnvAPIs} from 'test/helper';

describe('Component', () => {
    let MyComponent;
    let restoreAppEnv;

    beforeEach('init global App', function () {
        clearBaseCache();

        MyComponent = fakeComponent();
        restoreAppEnv = fakeAppEnvAPIs('swan');
    });

    afterEach('clear global App', function () {
        MyComponent = undefined;
        restoreAppEnv();
        expect.restoreSpies();
    });

    it('should inherit base api', () => {
        let componentInstance = {};
        let component = MyComponent(componentInstance);
        component.created();

        Object.keys(base).forEach(k => {
            assert(component[k] === base[k]);
        });
    });

    it('should call base created/attached/ready/detached in order', () => {
        const componentInstance = {
            created() {},
            attached() {},
            ready() {},
            detached() {}
        };
        testCallOrder(
            ['created', 'attached', 'ready', 'detached'],
            componentInstance,
            MyComponent,
            [component]
        );
    });

    it('should exist $app extension API', () => {
        let component = MyComponent({});
        component.created();
        assert(component.$app && typeof component.$app === 'object');
    });

    it('should exist $listener extension API', () => {
        let component = MyComponent({
            beforeCreate() {
                assert(component.$listener && component.$listener instanceof EventListener);
            }
        });
        component.created();
    });

    it('should exist $selector extension API', () => {
        let component = MyComponent({});
        component.created();
        assert(component.$selector == null);
        component.attached();
        assert(component.$selector && typeof component.$selector.select === 'function');
    });

    it('should call beforeCreate when created', () => {
        const componentInstance = {
            beforeCreate() {},
            created() {}
        };

        let spyBaseCreated = spyOn(component, 'created').andCallThrough();
        let spyCreated = spyOn(componentInstance, 'created')
            .andCallThrough();
        let spyBeforeCreate = spyOn(componentInstance, 'beforeCreate');
        let instance = MyComponent(componentInstance);
        instance.created();
        expect(spyBeforeCreate).toHaveBeenCalled();
        expect(spyCreated).toHaveBeenCalled();
        expect(spyBaseCreated).toHaveBeenCalled();
    });

    it('should call beforeMount when attached', () => {
        const componentInstance = {
            beforeMount() {},
            attached() {}
        };

        let spyBaseAttached = spyOn(component, 'attached').andCallThrough();
        let spyAttached = spyOn(componentInstance, 'attached')
            .andCallThrough();
        let spyBeforeMount = spyOn(componentInstance, 'beforeMount');
        let instance = MyComponent(componentInstance);
        instance.created();
        instance.attached();

        expect(spyBeforeMount).toHaveBeenCalled();
        expect(spyAttached).toHaveBeenCalled();
        expect(spyBaseAttached).toHaveBeenCalled();
    });

    it('should call mounted when ready', () => {
        const componentInstance = {
            mounted() {},
            ready() {}
        };

        let spyBaseReady = spyOn(component, 'ready').andCallThrough();
        let spyReady = spyOn(componentInstance, 'ready')
            .andCallThrough();
        let spyMounted = spyOn(componentInstance, 'mounted');
        let instance = MyComponent(componentInstance);
        instance.created();
        instance.attached();
        instance.ready();

        expect(spyMounted).toHaveBeenCalled();
        expect(spyBaseReady).toHaveBeenCalled();
        expect(spyReady).toHaveBeenCalled();
    });

    it('should call destroyed and beforeDestroy when detached', () => {
        const componentInstance = {
            beforeDestroy() {},
            detached() {},
            destroyed() {}
        };

        let spyBaseDetached = spyOn(component, 'detached')
            .andCallThrough();
        let spyDetached = spyOn(componentInstance, 'detached');

        let callDestroyOrder = [];
        let spyBeforeDestroy = spyOn(componentInstance, 'beforeDestroy')
            .andCall(() => callDestroyOrder.push(1));
        let spyDestroyed = spyOn(componentInstance, 'destroyed')
            .andCall(() => callDestroyOrder.push(2));
        let instance = MyComponent(componentInstance);
        instance.created();
        instance.attached();
        instance.ready();

        assert(instance.$selector != null);

        instance.$listener.on('xx', () => {});
        assert(instance.$listener._listeners.xx.length === 1);
        instance.detached();

        expect(spyBeforeDestroy).toHaveBeenCalled();
        expect(spyDestroyed).toHaveBeenCalled();
        assert(callDestroyOrder.join('') === '12');

        expect(spyBaseDetached).toHaveBeenCalled();
        expect(spyDetached).toHaveBeenCalled();

        assert(instance.$selector == null);
        expect(instance.$listener._listeners).toEqual({});
        assert(instance.$isDestroyed);
    });

    it('should call triggerEvent when call $emit if triggerEvent support', () => {
        let spyBaseTriggerEvent = createSpy(() => {});
        let spyOnAEvent = createSpy(() => {});
        let spyOnBEvent = createSpy(() => {});
        let fakeEventBData = {
            type: 'b',
            currentTarget: {
                dataset: {},
                id: 23
            },
            target: {
                dataset: {},
                id: 11
            },
            detail: 25
        };
        let instance = MyComponent({
            beforeCreate() {
                this.$on('a', spyOnAEvent);
                this.$on('b', spyOnBEvent);

                this.$emit('a', 2);
                this.$emit('b', fakeEventBData);
            },
            triggerEvent: spyBaseTriggerEvent
        });
        instance.properties = {
            dataFrom: 'xxx',
            dataName: 'jack',
            kk: 33
        };

        instance.created();
        instance.attached();
        instance.ready();

        instance.$emit('b', 3);
        expect(spyBaseTriggerEvent).toHaveBeenCalled();

        const dataset =  {
            from: 'xxx',
            name: 'jack'
        };
        expect(spyBaseTriggerEvent.calls[0].arguments).toEqual([
            'a',
            {
                type: 'a',
                currentTarget: {
                    dataset,
                    id: undefined
                },
                target: {
                    dataset,
                    id: undefined
                },
                detail: 2
            }
        ]);
        expect(spyBaseTriggerEvent.calls[1].arguments).toEqual(['b', fakeEventBData]);
        assert(spyBaseTriggerEvent.calls.length === 3);

        instance.$emit('a', 2);
        instance.detached();
        instance.$emit('a', 2);

        expect(spyOnAEvent).toHaveBeenCalled();
        assert(spyOnAEvent.calls.length === 2);
        expect(spyOnBEvent).toHaveBeenCalled();
    });

    it('should emit events normally if triggerEvent is not supported', () => {
        let spyOnAEvent = createSpy(() => {});
        let instance = MyComponent({
            beforeCreate() {
                this.$on('a', spyOnAEvent);
                this.$emit('a', 2);
            }
        });
        instance.created();
        instance.attached();
        instance.ready();

        instance.$emit('a', 2);
        instance.detached();
        instance.$emit('a', 2);

        expect(spyOnAEvent).toHaveBeenCalled();
        assert(spyOnAEvent.calls.length === 2);
    });

    it('should listen once when using once listen', () => {
        let spyOnAEvent = createSpy(() => {});
        let instance = MyComponent({
            beforeCreate() {
                instance.$once('a', spyOnAEvent);
                this.$emit('a', 2);
            }
        });

        instance.created();
        instance.attached();
        instance.ready();

        instance.$emit('a', 2);
        instance.detached();
        expect(spyOnAEvent).toHaveBeenCalled();
        assert(spyOnAEvent.calls.length === 1);
    });

    it('should off the given listener', () => {
        let spyOnAEvent = createSpy(() => {});
        let spyOnA2Event = createSpy(() => {});
        let spyOnBEvent = createSpy(() => {});
        let spyOnB2Event = createSpy(() => {});
        let instance = MyComponent({
            beforeCreate() {
                this.$on('a', spyOnAEvent);
                this.$on('a', spyOnA2Event);
                this.$on('b', spyOnBEvent);
                this.$on('b', spyOnB2Event);

                this.$emit('a', 2);
                this.$emit('b', 2);
            }
        });
        instance.created();
        instance.attached();
        instance.ready();

        instance.$off('a', spyOnAEvent);
        instance.$off('b');
        instance.$emit('a', 2);
        instance.$emit('b', 2);
        instance.detached();

        expect(spyOnAEvent).toHaveBeenCalled();
        assert(spyOnAEvent.calls.length === 1);

        expect(spyOnA2Event).toHaveBeenCalled();
        assert(spyOnA2Event.calls.length === 2);

        expect(spyOnBEvent).toHaveBeenCalled();
        assert(spyOnAEvent.calls.length === 1);

        expect(spyOnB2Event).toHaveBeenCalled();
        assert(spyOnAEvent.calls.length === 1);
    });

    it('should execute the given component plugin api in order', function () {
        let myPlugin = {
            component: {
                // created() {},
                // attached() {},
                // ready() {},
                // detached() {},
                methods: {
                    $emit() {},
                    test() {}
                }
            }
        };
        MyApp.use(myPlugin);

        let componentInstance = {
            created() {},
            attached() {},
            ready() {},
            detached() {},
            methods: {
                test() {}
            }
        };
        testCallOrder(
            ['created', 'attached', 'ready', 'detached', 'methods.test', 'methods.$emit'],
            componentInstance,
            MyComponent,
            [base, myPlugin.component]
        );
    });

    it('should extend the given component plugin', function () {
        let myPlugin = {
            component: {
                methods: {
                    test() {}
                }
            }
        };

        let spyPluginTest = spyOn(myPlugin.component.methods, 'test');
        MyApp.use(myPlugin);

        let componentInstance = {
            methods: {
                test2() {}
            }
        };
        let spyTest2 = spyOn(componentInstance.methods, 'test2');
        let instance = MyComponent(componentInstance);
        instance.created();
        instance.attached();
        instance.ready();

        instance.test();
        expect(spyPluginTest).toHaveBeenCalled();
        expect(spyPluginTest.calls[0].context).toBe(instance);

        instance.test2(2);
        expect(spyTest2).toHaveBeenCalledWith(2);
        expect(spyTest2.calls[0].context).toBe(instance);
    });

    it('should call $init before normalize', () => {
        let componentInstance = {
            $init() {
                assert(typeof this.data !== 'function');
                assert(!this.hi);
            },

            data() {
                return {a: 3};
            },
            methods: {
                hi() {}
            }
        };
        let spyInit = spyOn(componentInstance, '$init').andCallThrough();
        let component = MyComponent(componentInstance);

        expect(spyInit).toHaveBeenCalledWith(false, undefined);
        expect(spyInit.calls[0].context).toBe(componentInstance);
        assert(typeof component.hi === 'function');
    });

    it('should support function data', () => {
        let data = {a: 3};
        let instance = MyComponent({
            data() {
                return data;
            }
        });
        assert(instance.data === data);
    });

    it('should normalize props', () => {
        let instance = MyComponent({
            props: ['a', 'b']
        });
        expect(instance.properties).toEqual({
            a: {type: null},
            b: {type: null}
        });

        instance = MyComponent({
            props: {
                a: String,
                b: {type: Number},
                c: {type: Boolean},
                d: {type: Object},
                e: {type: Array},
                f: null,
                g: {
                    type: Number,
                    default: 12
                },
                h: {
                    type: Number,
                    value: 55,
                    default() {
                        return 12;
                    }
                },
                k: {
                    type: Object,
                    observer() {}
                }
            }
        });
        expect(instance.properties).toEqual({
            a: {type: String},
            b: {type: Number},
            c: {type: Boolean},
            d: {type: Object},
            e: {type: Array},
            f: {type: null},
            g: {
                type: Number,
                value: 12
            },
            h: {
                type: Number,
                value: 12
            },
            k: {
                type: Object,
                observer() {}
            }
        });

        instance = MyComponent({
            props: {}
        });
        expect(instance.properties).toEqual({});

        instance = MyComponent({
            props: []
        });
        expect(instance.properties).toEqual({});

        instance = MyComponent({});
        assert(instance.properties === undefined);

        let createComponent = () => {
            MyComponent({
                props: {
                    a: Function
                }
            });
        };
        assert.throws(createComponent, function (err) {
            return err.isTypeError;
        });

        createComponent = () => {
            MyComponent({
                props: [{type: String}]
            });
        };
        assert.throws(createComponent, function (err) {
            return err.isTypeError;
        });

        createComponent = () => {
            MyComponent({
                props: {
                    a: [String, Number]
                }
            });
        };
        assert.throws(createComponent, function (err) {
            return err.isTypeError;
        });

        createComponent = () => {
            MyComponent({
                props: {
                    a: {
                        type: [String, Number]
                    }
                }
            });
        };
        assert.throws(createComponent, function (err) {
            return err.isTypeError;
        });
    });

    it('should normalize mixins', () => {
        let mixins = ['wx://form', {}];
        let instance = MyComponent({
            mixins
        });
        assert(instance.behaviors === mixins);

        let behaviors = ['wx://form'];
        instance = MyComponent({
            behaviors,
            mixins
        });
        assert(instance.behaviors === behaviors);
    });

    it('should normalize methods', () => {
        const extendPropMethods = [
            'beforeCreate',
            'beforeMount', 'mounted',
            'beforeDestroy', 'destroyed',
            'beforeUpdate', 'updated'
        ];
        const notExistedProps = [
            '$rawComputed',
            '$rawWatch',
            '$rawProps'
        ];

        const computedValue = {};
        let instance = MyComponent({
            beforeCreate() {},
            beforeMount() {},
            mounted() {},
            beforeDestroy() {},
            destroyed() {},
            beforeUpdate() {},
            updated() {},
            props: {
                a: {
                    type: Number
                }
            },
            data: {
                c: 'xx'
            },
            computed: computedValue,
            watch: {
                c() {
                    // do sth.
                }
            },
            methods: {
                hi() {}
            }
        });

        notExistedProps.forEach(k => {
            let value = instance.methods[k];
            assert(value === undefined);
        });

        extendPropMethods.forEach(k => {
            let value = instance.methods[k];
            assert(typeof value === 'function');
            assert(value === instance[k]);
        });

        assert(typeof instance.hi === 'function');
    });

    it('should call user defined methods when trigger event', () => {
        let spyClk = createSpy(() => {});
        let spyInput = createSpy(() => {});
        let spyTouch = createSpy(() => {});
        let spyChange = createSpy(() => {});
        let instance = MyComponent({
            methods: {
                clk: spyClk,
                input: spyInput,
                touch: spyTouch,
                change: spyChange
            }
        });
        instance.created();

        let eventData = {a: 3};
        let fakeEventData = {
            type: 'click',
            currentTarget: {
                dataset: {
                    clickModifierSelf: true,
                    clickEventProxy: 'clk',
                    clickArgumentsProxy: [eventData, 'xx'],
                    clickEventObjectAlias: 'xx',

                    inputModifierSelf: false,
                    inputEventProxy: 'input',
                    inputArgumentsProxy: [eventData],

                    touchModifierSelf: false,
                    touchEventProxy: 'touch'
                },
                id: 23
            },
            target: {
                dataset: {},
                id: 11
            },
            detail: 25
        };
        instance.__handlerProxy(fakeEventData);
        expect(spyClk).toNotHaveBeenCalled();

        fakeEventData.currentTarget.id = fakeEventData.target.id;
        instance.__handlerProxy(fakeEventData);
        expect(spyClk).toHaveBeenCalledWith(eventData, fakeEventData);
        expect(spyClk.calls[0].context).toBe(instance);

        fakeEventData.type = 'input';
        instance.__handlerProxy(fakeEventData);
        expect(spyInput).toHaveBeenCalledWith(eventData);

        fakeEventData.type = 'touch';
        instance.__handlerProxy(fakeEventData);
        expect(spyTouch).toHaveBeenCalledWith(fakeEventData);

        fakeEventData.type = 'change';
        instance.__handlerProxy(fakeEventData);
        expect(spyChange).toNotHaveBeenCalled();
    });
});
