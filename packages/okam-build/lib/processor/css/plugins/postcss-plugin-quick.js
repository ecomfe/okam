/**
 * @file Postcss plugin to fix css rules for quick app
 * @author sparklewhy@gmail.com
 */

'use strict';

const postcss = require('postcss');

const ABBREV_COLOR_VALUE = /(^|\s+)(#[0-9A-Fa-f]{3})($|\s+)/;
const COLOR_VALUE = /^#[0-9A-Fa-f]{6}$/;

const NOT_SUPPORTED_BORDER_STYLES = [
    'border-left', 'border-right',
    'border-top', 'border-bottom'
];

function normalizeColor(value) {
    let result = '#';
    for (let i = 1; i < 4; i++) {
        let c = value.charAt(i);
        result += (c + c);
    }
    return result;
}

function transformBorderValue(prop, value, decl) {
    let parts = value.split(' ');

    parts.forEach(item => {
        item = item.trim();
        if (!item) {
            return;
        }

        let newPropDecl;
        if (/^\d+/.test(item)) {
            newPropDecl = {prop: `${prop}-width`, value: item};
        }
        else if (item.startsWith('#')) {
            newPropDecl = {prop: `${prop}-color`, value: item};
        }
        else {
            newPropDecl = {prop: 'border-style', value: item};
        }

        decl.parent.insertBefore(decl, newPropDecl);
    });

    decl.remove();
}

const styleDeclTransformers = [
    {
        match(prop) {
            return prop === 'background' || prop === 'background-color';
        },
        transform(decl) {
            let {value} = decl;
            if (!value) {
                return;
            }

            value = value.trim();
            if (ABBREV_COLOR_VALUE.test(value)) {
                decl.prop = 'background-color';
                decl.value = normalizeColor(value);
            }
            else if (COLOR_VALUE.test(value)) {
                decl.prop = 'background-color';
            }
        }
    },
    {
        match(prop) {
            return prop.startsWith('border');
        },
        transform(decl) {
            let {prop, value} = decl;
            if (!value) {
                return;
            }

            value = value.trim();

            // none is not supported in quick app
            if (value === 'none') {
                decl.value = value = '0';
            }
            else {
                decl.value = value = value.replace(
                    ABBREV_COLOR_VALUE,
                    (match, prefix, color, suffix) =>
                        (prefix + normalizeColor(color) + suffix)
                );
            }

            if (NOT_SUPPORTED_BORDER_STYLES.includes(prop)) {
                transformBorderValue(prop, value, decl);
            }
        }
    },
    {
        match: 'box-sizing',
        transform(decl) {
            // only support box-sizing and do not support box-sizing property
            let {value} = decl;
            value && (value = value.trim());
            if (value === 'border-box') {
                decl.remove();
            }
        }
    },
    {
        match: 'font-weight',
        transform(decl) {
            let {value} = decl;
            value = value && parseInt(value.trim(), 10);

            if (typeof value === 'number') {
                if (value < 600) {
                    value = 'normal';
                }
                else {
                    value = 'bold';
                }

                decl.value = value;
            }
        }
    },
    {
        match: 'display',
        transform(decl) {
            let {value} = decl;
            value = value && value.trim();
            if (value === 'block') {
                decl.value = 'flex';
            }
            else if (value === 'inline') {
                decl.value = 'none';
            }
        }
    },
    {
        match: 'position',
        transform(decl) {
            let {value} = decl;
            value = value && value.trim();
            if (value === 'absolute') {
                value = 'fixed';
            }
            else if (value === 'relative') {
                value = 'none';
            }
            decl.value = value;
        }
    },
    {
        match(prop, decl) {
            let {value} = decl;
            value && (value = value.trim());
            if (value) {
                value = value.replace(/(vh|vw)$/, '%');
                decl.value = value;
            }
        }
    }
];

module.exports = postcss.plugin('postcss-plugin-quick', function (opts = {}) {
    return function (css, result) {

        css.walkDecls(decl => {
            let {prop} = decl;

            styleDeclTransformers.forEach(({match, transform}) => {
                if (typeof match === 'string') {
                    prop === match && transform(decl);
                }
                else if (typeof match === 'function') {
                    match(prop, decl) && transform(decl);
                }
            });
        });
    };
});
