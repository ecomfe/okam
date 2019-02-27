/**
 * @file transform regexp constants
 * @author sharonzd
 */

'use strict';

exports.DATA_BIND_REGEXP = /^:/;
exports.CURLY_BRACE_HAS_REGEXP = /{[\s\S]*}/;
exports.SQUARE_BRACKETS_REGEXP = /^\[[\s\S]*\]$/;
exports.BRACKET_REGEXP = /\(|\)/g;
exports.EVENT_REGEXP = /^@/;
exports.EVENT_HANDLE_REGEXP = /^(\w+)\s*(?:\((.+)?\))?$/;
exports.VARIABLE_EVENT = /([^'])\$event([^'])/g;
exports.PLAIN_OBJECT_REGEXP = /^{[\s\S]*}$/;
exports.FOR_ITEM_INDEX_REGEXP = /^(.+)\s+in\s+(.+)$/;

exports.CONDITION_DIRECTIVES = ['if', 'elif', 'else-if', 'else'];

exports.NOT_SUPPORT_MODIFIERS = ['prevent', 'once', 'passive'];

exports.ENV_ELEMENT_REGEXP = /\-env$/;
