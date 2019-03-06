/**
 * @file UI Helper
 * @author sparklewhy@gmail.com
 */

'use strict';

export function escape(str) {
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/'/g, '&#39;')
        .replace(/"/g, '&quot;');
}

export function renderTpl(tpl, data, needEscape) {
    return tpl.replace(/\${(.*?)}/g, (match, key) => {
        let value = data[key];
        return (needEscape && typeof value === 'string') ? escape(value) : value;
    });
}


