/**
 * @file Logger test case
 * @author sparklewhy@gmail.com
 */

'use strict';

import expect, {spyOn} from 'expect';
import assert from 'assert';
import logger, {Logger, getLogger, create as createLogger} from '../../lib/logger';

describe('Logger', () => {
    afterEach('restore spy', function () {
        expect.restoreSpies();
    });

    it('should export default logger instance', () => {
        assert(logger instanceof Logger);
    });

    it('should create logger instance', () => {
        let instance = createLogger({prefix: 'myPrefix', level: 'error'});
        assert(instance instanceof Logger);

        let spyLog = spyOn(instance, 'doLog').andCallThrough();
        instance.info('xxx');
        expect(spyLog).toNotHaveBeenCalled();

        instance.error('xxx');
        expect(spyLog).toHaveBeenCalledWith('myPrefix', 'error', 'xxx');
        assert(spyLog.calls.length === 1);
    });

    it('should get the existed logger when call getLogger', () => {
        let instance = getLogger({prefix: 'xxx'});
        let spyLog = spyOn(instance, 'doLog').andCallThrough();

        instance.error('abc');
        expect(spyLog).toHaveBeenCalledWith('xxx', 'error', 'abc');
        assert(spyLog.calls.length === 1);

        let instance2 = getLogger({prefix: 'xxx2'});
        assert(instance === instance2);

        instance.info('abc');
        expect(spyLog).toHaveBeenCalledWith('xxx', 'info', 'abc');
        assert(spyLog.calls.length === 2);
    });

    it('should print log by the level', () => {
        let instance = createLogger({prefix: 'p', level: 'debug'});
        let spyLog = spyOn(instance, 'doLog').andCallThrough();

        instance.debug('a', {a: 2});
        expect(spyLog).toHaveBeenCalledWith('p', 'debug', 'a', {a: 2});
        assert(spyLog.calls.length === 1);

        instance.trace('a', {a: 2});
        expect(spyLog).toHaveBeenCalledWith('p', 'trace', 'a', {a: 2});
        assert(spyLog.calls.length === 2);

        instance.info('a', {a: 2});
        expect(spyLog).toHaveBeenCalledWith('p', 'info', 'a', {a: 2});
        assert(spyLog.calls.length === 3);

        instance.warn('a', {a: 2});
        expect(spyLog).toHaveBeenCalledWith('p', 'warn', 'a', {a: 2});
        assert(spyLog.calls.length === 4);

        instance.error('a', {a: 2});
        expect(spyLog).toHaveBeenCalledWith('p', 'error', 'a', {a: 2});
        assert(spyLog.calls.length === 5);
    });
});
