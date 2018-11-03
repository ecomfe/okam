/**
 * @file transform regexp constants
 * @author sharonzd
 * @date 2018/8/7
 */

'use strict';

exports.DATA_BIND_REGEXP = /^:/;
exports.CURLY_BRACE_HAS_REGEXP = /{.*}/;
exports.SQUARE_BRACKETS_REGEXP = /^\[.*\]$/;
exports.BRACKET_REGEXP = /\(|\)/g;
exports.EVENT_REGEXP = /^@/;
exports.EVENT_HANDLE_REGEXP = /^(\w+)\s*(?:\((.+)?\))?$/;
exports.VARIABLE_EVENT = /([^'])\$event([^'])/g;
exports.PLAIN_OBJECT_REGEXP = /^{.*}$/;

exports.CONDITION_DIRECTIVES = ['if', 'elif', 'else-if', 'else'];

exports.NOT_SUPPORT_MODIFIERS = ['prevent', 'once', 'passive'];
