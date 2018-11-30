/**
 * @file url test spec
 * @author sparklewhy@gmail.com
 */

'use strict';

import expect from 'expect';
import {parseQuery} from 'core/util/url';

describe('App', () => {
    it('parseQuery', () => {
        let query = parseQuery('');
        expect(query).toEqual({});

        query = parseQuery('a');
        expect(query).toEqual({a: true});

        query = parseQuery('a&b=23');
        expect(query).toEqual({a: true, b: '23'});

        query = parseQuery('a&b=23&c=ss&b=gg');
        expect(query).toEqual({a: true, b: 'gg', c: 'ss'});

        let key = '=a';
        let encodedKey = encodeURIComponent(key);
        let value = '中';
        let encodeValue = encodeURIComponent(value);
        query = parseQuery(`b=2&${encodedKey}=${encodeValue}`);
        expect(query).toEqual({[key]: value, b: '2'});
    });
});
