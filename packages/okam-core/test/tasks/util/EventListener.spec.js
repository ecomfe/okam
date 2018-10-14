/**
 * @file EventListener test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import assert from 'assert';
import expect, {createSpy} from 'expect';
import EventListener from 'core/util/EventListener';

describe('EventListener', function () {
    it('should listen the given event name', () => {
        let listener = new EventListener();
        let spyHandler = createSpy(() => {});
        let spyHandler2 = createSpy(() => {});
        listener.on('event', spyHandler);
        listener.on('event', spyHandler2);

        listener.emit('event', 2, {a: 3});
        expect(spyHandler).toHaveBeenCalledWith(2, {a: 3});
        expect(spyHandler.calls[0].context).toBe(listener);
        assert(spyHandler.calls.length === 1);

        expect(spyHandler2).toHaveBeenCalledWith(2, {a: 3});
        expect(spyHandler2.calls[0].context).toBe(listener);
        assert(spyHandler2.calls.length === 1);

        listener.emit('event', 2, {a: 3});
        assert(spyHandler.calls.length === 2);
        assert(spyHandler2.calls.length === 2);
    });

    it('should listen the given event name once', () => {
        let listener = new EventListener();
        let spyHandler = createSpy(() => {});
        listener.once('event', spyHandler);

        listener.emit('event', 2, {a: 3});
        expect(spyHandler).toHaveBeenCalledWith(2, {a: 3});
        expect(spyHandler.calls[0].context).toBe(listener);
        assert(spyHandler.calls.length === 1);

        listener.emit('event', 2, {a: 3});
        assert(spyHandler.calls.length === 1);
    });

    it('should listen all events', () => {
        let listener = new EventListener();
        let spyHandler = createSpy(() => {});
        let spyHandler2 = createSpy(() => {});
        listener.once('*', spyHandler);
        listener.on('*', spyHandler2);

        listener.emit('event', 2, {a: 3});
        listener.emit('event2', 2, {a: 3});
        expect(spyHandler).toHaveBeenCalledWith('event', 2, {a: 3});
        assert(spyHandler.calls.length === 1);

        expect(spyHandler2).toHaveBeenCalled();
        assert(spyHandler2.calls.length === 2);
        expect(spyHandler2.calls[0].arguments).toEqual(['event', 2, {a: 3}]);
        expect(spyHandler2.calls[1].arguments).toEqual(['event2', 2, {a: 3}]);
    });

    it('should remove specified listeners', () => {
        let listener = new EventListener();
        let spyHandler = createSpy(() => {});
        let spyHandler2 = createSpy(() => {});
        let spyHandler3 = createSpy(() => {});
        let spyHandler4 = createSpy(() => {});
        let spyHandler5 = createSpy(() => {});
        listener.once('*', spyHandler);
        listener.on('*', spyHandler2);
        listener.on('*', spyHandler3);
        listener.on('event', spyHandler4);
        listener.on('event', spyHandler5);

        listener.off('*', spyHandler);
        listener.off('*', spyHandler2);
        listener.off('event', spyHandler4);

        listener.emit('event', 2, {a: 3});
        listener.emit('event2', 2, {a: 3});
        expect(spyHandler).toNotHaveBeenCalled();
        expect(spyHandler2).toNotHaveBeenCalled();
        expect(spyHandler4).toNotHaveBeenCalled();
        expect(spyHandler3).toHaveBeenCalled();
        expect(spyHandler5).toHaveBeenCalled();
    });

    it('should remove all specified event name listeners', () => {
        let listener = new EventListener();
        let spyHandler = createSpy(() => {});
        let spyHandler2 = createSpy(() => {});
        let spyHandler3 = createSpy(() => {});
        let spyHandler4 = createSpy(() => {});
        let spyHandler5 = createSpy(() => {});
        listener.once('*', spyHandler);
        listener.on('*', spyHandler2);
        listener.on('event', spyHandler3);
        listener.on('event', spyHandler4);
        listener.on('event2', spyHandler5);

        listener.off('*');
        listener.off('event');

        listener.emit('event', 2, {a: 3});
        listener.emit('event2', 2, {a: 3});
        expect(spyHandler).toNotHaveBeenCalled();
        expect(spyHandler2).toNotHaveBeenCalled();
        expect(spyHandler3).toNotHaveBeenCalled();
        expect(spyHandler4).toNotHaveBeenCalled();
        expect(spyHandler5).toHaveBeenCalled();
    });

    it('should remove all listeners', () => {
        let listener = new EventListener();
        let spyHandler = createSpy(() => {});
        let spyHandler2 = createSpy(() => {});
        let spyHandler3 = createSpy(() => {});
        let spyHandler4 = createSpy(() => {});
        let spyHandler5 = createSpy(() => {});
        listener.once('*', spyHandler);
        listener.on('*', spyHandler2);
        listener.on('event', spyHandler3);
        listener.on('event', spyHandler4);
        listener.on('event2', spyHandler5);
        listener.dispose();

        expect(spyHandler).toNotHaveBeenCalled();
        expect(spyHandler2).toNotHaveBeenCalled();
        expect(spyHandler3).toNotHaveBeenCalled();
        expect(spyHandler4).toNotHaveBeenCalled();
        expect(spyHandler5).toNotHaveBeenCalled();
    });
});
