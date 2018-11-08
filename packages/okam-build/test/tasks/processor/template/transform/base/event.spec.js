/**
 * @file The event processor test spec
 * 缺少随机数分支的测试，无法预知会取出的随机数，因此覆盖率未达到100%。
 *
 * @author Sharon_zd@qq.com
 */

'use strict';

const assert = require('assert');
const {fakeProcessorOptions, getTemplateEventPlugin} = require('test/helper');
const templateProcessor = require('okam/processor/template/index');

describe('事件类型转化', function () {
    it('should transform event-binding syntax @ to bind syntax（转化非click的事件）', function () {
        const file = {
            content: '<div @touchstart=" handleClick "></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content
            === '<view bindtouchstart="__handlerProxy" data-touchstart-event-proxy="handleClick"></view>');
    });

    it('should transform event-binding syntax @ to bind syntax（click会转发为tap）', function () {
        const file = {
            content: '<div @click=" handleClick "></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></view>');
    });
});

describe('修饰符', function () {
    it('should transform event-binding modifier .stop to catch syntax', function () {
        const file = {
            content: '<div @click.stop=" handleClick "></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content, '<view catchtap="__handlerProxy" data-tap-event-proxy="handleClick"></view>');
    });

    it('should transform event-binding modifier .capture to capture-bind syntax', function () {
        const file = {
            content: '<div @click.capture=" handleClick "></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content,
            '<view capture-bind:tap="__handlerProxy" data-tap-event-proxy="handleClick"></view>');
    });

    it('should transform event-binding modifier .capture.stop to capture-catchtap syntax', function () {
        const file = {
            content: '<div @click.capture.stop=" handleClick "></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert.equal(result.content,
            '<view capture-catch:tap="__handlerProxy" data-tap-event-proxy="handleClick"></view>');
    });

    it('should transform event-binding modifier .self', function () {
        const file = {
            content: '<div @click.self=" handleClick "></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view bindtap="__handlerProxy" '
            + 'data-tap-event-proxy="handleClick" data-tap-modifier-self></view>');
    });

    it('should transform event-binding with modifier .capture .stop .self', function () {
        const file = {
            content: '<div @click.self.stop.capture=" handleClick "></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view capture-catch:tap="__handlerProxy" '
            + 'data-tap-event-proxy="handleClick" data-tap-modifier-self></view>');
    });
});

describe('事件代理及传参', function () {
    it('should agent event handler', function () {
        const file = {
            content: '<div @click="handleClick"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></view>');
    });

    it('should transform event handler with brace', function () {
        const file = {
            content: '<div @click=" handleClick "></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></view>');
    });

    it('should transform event handler with empty bracket', function () {
        const file = {
            content: '<div @click="handleClick ()"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></view>');
    });

    it('should transform event handler with arguments', function () {
        const file = {
            content: '<div @click="handleClick  ((a ? 1 : 0), \'a & b\', b, [1,2,3], {a:1,b:2})"></div>'
        };

        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view bindtap="__handlerProxy" data-tap-event-proxy="handleClick" '
            + 'data-tap-arguments-proxy="{{[(a ? 1 : 0), \'a & b\', b, [1,2,3], {a:1,b:2}]}}"></view>');
    });

    it('should transform more event with arguments', function () {
        const file = {
            content: '<div @click="handleClick  ((a ? 1 : 0), \'a & b\', b, [1,2,3], {a:1,b:2})" '
            + '@touchmove="handleMove(1)"></div>'
        };

        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view bindtap="__handlerProxy" '
            + 'data-tap-event-proxy="handleClick" '
            + 'data-tap-arguments-proxy="{{[(a ? 1 : 0), \'a & b\', b, [1,2,3], {a:1,b:2}]}}" '
            + 'bindtouchmove="__handlerProxy" '
            + 'data-touchmove-event-proxy="handleMove" '
            + 'data-touchmove-arguments-proxy="{{[1]}}"></view>');
    });


});

describe('passing on event object', function () {
    it('should transform $event', function () {
        const file = {
            content: '<div @click="hi($event)"></div>'
        };
        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result && result.ast && result.ast[0] && result.ast[0].attribs);

        const {
            bindtap: proxyFunction,
            'data-tap-event-proxy': originFunction,
            'data-tap-arguments-proxy': proxyArguments,
            'data-tap-event-object-alias': alias
        } = result.ast[0].attribs;
        assert(proxyFunction && originFunction && proxyArguments && alias);

        const aliasArray = alias.split('_');
        assert(proxyFunction === '__handlerProxy');
        assert(originFunction === 'hi');
        assert(aliasArray[0] && aliasArray[0].length > 1);
        assert(aliasArray[1] === '$event');
        assert(proxyArguments === `{{['${aliasArray[0]}_$event']}}`);
    });

    it('should transform two $event', function () {
        const file = {
            content: '<div @click="hi($event,$event)"></div>'
        };

        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result && result.ast && result.ast[0] && result.ast[0].attribs);

        const {
            bindtap: proxyFunction,
            'data-tap-event-proxy': originFunction,
            'data-tap-arguments-proxy': proxyArguments,
            'data-tap-event-object-alias': alias
        } = result.ast[0].attribs;
        assert(proxyFunction && originFunction && proxyArguments && alias);

        const aliasArray = alias.split('_');
        assert(proxyFunction === '__handlerProxy');
        assert(originFunction === 'hi');
        assert(aliasArray[0] && aliasArray[0].length > 1);
        assert(aliasArray[1] === '$event');
        assert(proxyArguments === `{{['${aliasArray[0]}_$event', '${aliasArray[0]}_$event']}}`);
    });

    it('should transform $event with \'$event\'', function () {
        const file = {
            content: '<div @click="hi($event,$event,\'$event\')"></div>'
        };

        const result = templateProcessor(file, fakeProcessorOptions());
        assert(result && result.ast && result.ast[0] && result.ast[0].attribs);

        const {
            bindtap: proxyFunction,
            'data-tap-event-proxy': originFunction,
            'data-tap-arguments-proxy': proxyArguments,
            'data-tap-event-object-alias': alias
        } = result.ast[0].attribs;
        assert(proxyFunction && originFunction && proxyArguments && alias);

        const aliasArray = alias.split('_');
        assert(proxyFunction === '__handlerProxy');
        assert(originFunction === 'hi');
        assert(aliasArray[0] && aliasArray[0].length > 1);
        assert(aliasArray[1] === '$event');
        assert(proxyArguments === `{{['${aliasArray[0]}_$event', '${aliasArray[0]}_$event','$event']}}`);
    });
});

describe('show log', function () {
    it('如果使用了不支持的修饰符，给出警告', function () {
        const file = {
            path: 'event.tpl',
            content: '<div @click.once=" handleClick "></div>'
            + '<div @click.passive=" handleClick "></div>'
            + '<div @click.prevent=" handleClick "></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></view>'
            + '<view bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></view>'
            + '<view bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></view>');
    });

    it('有重复属性时，给出警告并保留okam语法的键值', function () {
        const file = {
            path: 'event.tpl',
            content: '<div bindtap="hi" @click=" handleClick "></div>'
        };
        let result = templateProcessor(file, fakeProcessorOptions());
        assert(result.content === '<view bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></view>');
    });
});

describe('event transform', function () {
    it('should transform wx click event to tap', function () {
        let file = {
            path: 'event.tpl',
            content: '<button @click=" handleClick "></button>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(null, [
            getTemplateEventPlugin('wx')
        ]));
        assert(result.content === '<button bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></button>');
    });

    it('should not transform wx click event to tap for custom component', function () {
        let file = {
            path: 'event.tpl',
            content: '<hello @click=" handleClick "></hello>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(null, [
            [
                getTemplateEventPlugin('wx'),
                {
                    customComponentTags: ['hello']
                }
            ]
        ]));
        assert(result.content === '<hello bindclick="__handlerProxy" data-click-event-proxy="handleClick"></hello>');
    });

    it('should transform swan click event to tap', function () {
        let file = {
            path: 'event.tpl',
            content: '<button @click=" handleClick "></button>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(null, [
            getTemplateEventPlugin('swan')
        ]));
        assert(result.content === '<button bindtap="__handlerProxy" data-tap-event-proxy="handleClick"></button>');
    });

    it('should not transform swan click event to tap for custom component', function () {
        let file = {
            path: 'event.tpl',
            content: '<hello @click=" handleClick "></hello>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(null, [
            [
                getTemplateEventPlugin('swan'),
                {
                    customComponentTags: ['hello']
                }
            ]
        ]));
        assert(result.content === '<hello bindclick="__handlerProxy" data-click-event-proxy="handleClick"></hello>');
    });

    it('should transform ant click event to tap', function () {
        let file = {
            path: 'event.tpl',
            content: '<button @click=" handleClick "></button>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(null, [
            getTemplateEventPlugin('ant')
        ]));
        assert(result.content === '<button onTap="__handlerProxy" data-tap-event-proxy="handleClick"></button>');
    });

    it('should not transform swan click event to tap for custom component', function () {
        let file = {
            path: 'event.tpl',
            content: '<hello @click=" handleClick "></hello>'
        };
        let result = templateProcessor(file, fakeProcessorOptions(null, [
            [
                getTemplateEventPlugin('ant'),
                {
                    customComponentTags: ['hello']
                }
            ]
        ]));
        assert(result.content === '<hello onClick="__handlerProxy" data-click-event-proxy="handleClick"></hello>');
    });
});
