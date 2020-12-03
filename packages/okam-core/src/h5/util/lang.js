/**
 * @file The language utilities
 * @author sparklewhy@gmail.com
 */

'use strict';

export function isSimpleType(value) {
    let type = typeof value;
    return type === 'string' || type === 'number' || type === 'boolean';
}

