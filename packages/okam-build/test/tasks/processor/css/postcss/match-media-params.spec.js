/**
 * @file Postcss match media params test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

const assert = require('assert');
const expect = require('expect');
const matchAppMediaParams = require('okam/processor/css/plugins/match-media-params');

describe('Match app media params', () => {
    it('should do nothing when none app media type match', () => {
        let allAppTypes = ['wx', 'swan', 'ant', 'quick'];
        let result = matchAppMediaParams(allAppTypes, 'wx', 'screen');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', 'speech and (aspect-ratio: 11/5)');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', '(not (color)) or (hover)');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', '(not(hover))');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', '(30em <= width <= 50em )');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', '(min-width: 30em) and (max-width: 50em)');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', '(only screen and (color))');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', '(not (screen and (color))), print and (color)');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', '(not all) and (monochrome)');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', '(min-height: 680px), screen and (orientation: portrait)');
        assert(result === undefined);

        result = matchAppMediaParams(allAppTypes, 'wx', ' ');
        assert(result === undefined);
    });

    it('should match app media type', () => {
        let allAppTypes = ['wx', 'swan', 'ant', 'quick'];
        let result = matchAppMediaParams(allAppTypes, 'wx', 'wx');
        expect(result).toEqual({
            expression: '(\'wx\' === \'wx\')',
            params: '',
            removed: false
        });

        result = matchAppMediaParams(allAppTypes, 'wx', 'wx and (aspect-ratio: 11/5)');
        expect(result).toEqual({
            expression: '(\'wx\' === \'wx\')',
            params: ' (aspect-ratio: 11/5)',
            removed: false
        });

        result = matchAppMediaParams(allAppTypes, 'wx', '(not (quick)) or (hover)');
        expect(result).toEqual({
            expression: '(!((\'quick\' === \'wx\')))',
            params: ' (hover)',
            removed: false
        });

        result = matchAppMediaParams(allAppTypes, 'wx', '(not(wx))');
        expect(result).toEqual({
            expression: '(!((\'wx\' === \'wx\')))',
            removed: true
        });

        result = matchAppMediaParams(allAppTypes, 'wx', '(wx, swan) and (30em <= width <= 50em )');
        expect(result).toEqual({
            expression: '((\'wx\' === \'wx\')||(\'swan\' === \'wx\'))',
            params: ' (30em <= width <= 50em )',
            removed: false
        });

        result = matchAppMediaParams(allAppTypes, 'wx', 'wx, swan');
        expect(result).toEqual({
            expression: '(\'wx\' === \'wx\')||(\'swan\' === \'wx\')',
            params: '',
            removed: false
        });

        result = matchAppMediaParams(allAppTypes, 'wx', '(only quick and (color))');
        expect(result).toEqual({
            expression: '(\'quick\' === \'wx\')',
            removed: true
        });
    });
});
