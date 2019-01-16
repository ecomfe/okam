/**
 * @file Postcss plugin to fix css rules for quick app
 * @author sparklewhy@gmail.com
 */

'use strict';

const postcss = require('postcss');

const HAS_ABBREV_COLOR_VALUE = /(^|\s+)(#[0-9A-Fa-f]{3})($|\s+)/;
const COLOR_VALUE = /(^|\s+)(#[0-9A-Fa-f]{3,6})($|\s+)/;

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
            return prop === 'background';
        },
        transform(decl) {
            let {value} = decl;
            if (!value) {
                return;
            }

            // convert background: #ccc => background-color: #cccccc
            // background: top left url(./img/xx.png) #ccc no-repeat
            // => background-color: #ccc; background-position: top left;
            //    background-image: url(./img/xx.png); background-repeat: no-repeat;
            value = value.replace(/(^|\s+)(url\(.+\))/, (match, prefix, url) => {
                let newPropDecl = {prop: 'background-image', value: url};
                decl.parent.insertAfter(decl, newPropDecl);
                return prefix;
            });

            value = value.replace(
                /(^|\s+)(repeat|repeat\-x|repeat\-y|no\-repeat)(\s+|$)/,
                (match, prefix, value, suffix) => {
                    let newPropDecl = {prop: 'background-repeat', value};
                    decl.parent.insertAfter(decl, newPropDecl);
                    return prefix + suffix;
                }
            );

            value = value.replace(COLOR_VALUE, (match, prefix, value, suffix) => {
                if (value.length === 4) {
                    value = normalizeColor(value);
                }
                let newPropDecl = {prop: 'background-color', value};
                decl.parent.insertAfter(decl, newPropDecl);
                return prefix + suffix;
            });

            value = value.trim();
            if (value) {
                let newPropDecl = {prop: 'background-position', value};
                decl.parent.insertAfter(decl, newPropDecl);
            }

            decl.remove();
        }
    },
    {
        match(prop) {
            return prop === 'background-color';
        },
        transform(decl) {
            let {value} = decl;
            if (!value) {
                return;
            }

            // convert background-color: #c2d => background-color: #cc22dd
            value = value.trim();
            if (value.length === 4) {
                value = normalizeColor(value);
                decl.value = value;
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

            // convert border: none => border: 0
            // convert border: 1px solid #c2d => border: 1px solid #cc22dd

            // none is not supported in quick app
            if (value === 'none') {
                decl.value = value = '0';
            }
            else {
                decl.value = value = value.replace(
                    HAS_ABBREV_COLOR_VALUE,
                    (match, prefix, color, suffix) =>
                        (prefix + normalizeColor(color) + suffix)
                );
            }

            // convert border-left: 1px solid #ccc =>
            // border-left-width: 1px;
            // border-left-style: solid;
            // border-left-color: #ccc;
            // border-right/border-top/border-bottom is the same as border-left
            if (NOT_SUPPORTED_BORDER_STYLES.includes(prop)) {
                transformBorderValue(prop, value, decl);
            }
        }
    },
    // {
    //     match: 'box-sizing',
    //     transform(decl) {
    //         // only support box-sizing and do not support box-sizing property
    //         let {value} = decl;
    //         value && (value = value.trim());
    //         if (value === 'border-box') {
    //             decl.remove();
    //         }
    //     }
    // },
    {
        match: 'font-weight',
        transform(decl) {
            let {value} = decl;
            value = value && parseInt(value.trim(), 10);

            // convert font-weight: number => font-weight: normal/bold
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

            // convert display: block => display: flex
            if (value === 'block') {
                decl.value = 'flex';
            }
        }
    },
    {
        match: 'position',
        transform(decl) {
            let {value} = decl;
            value = value && value.trim();

            // convert position: absolute => position: fixed
            if (value === 'absolute') {
                value = 'fixed';
            }

            decl.value = value;
        }
    }
];

module.exports = postcss.plugin('postcss-plugin-quickcss', function (opts = {}) {
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
