/**
 * @file Test helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const fs = require('fs');
const logger = require('okam/util').logger;

const initBuildOption = require('okam/build/init-build-options');
const vueSyntax = require('okam/processor/template/plugins/vue-prefix-plugin');
const swanSyntax = require('okam/processor/template/plugins/swan-syntax-plugin');
const wxSyntax = require('okam/processor/template/plugins/wx-syntax-plugin');
const antSyntax = require('okam/processor/template/plugins/ant-syntax-plugin');
const ttSyntax = require('okam/processor/template/plugins/tt-syntax-plugin');

const html = require('okam/processor/template/plugins/tag-transform-plugin');
const ref = require('okam/processor/template/plugins/ref-plugin');
const swanEventPlugin = require('okam/processor/template/plugins/event/swan-event-plugin');
const wxEventPlugin = require('okam/processor/template/plugins/event/wx-event-plugin');
const antEventPlugin = require('okam/processor/template/plugins/event/ant-event-plugin');
const ttEventPlugin = require('okam/processor/template/plugins/event/tt-event-plugin');

const swanModelPlugin = require('okam/processor/template/plugins/model/swan-model-plugin');
const wxModelPlugin = require('okam/processor/template/plugins/model/wx-model-plugin');
const antModelPlugin = require('okam/processor/template/plugins/model/ant-model-plugin');
const ttModelPlugin = require('okam/processor/template/plugins/model/tt-model-plugin');


const defaultTags = {
    div: 'view',
    p: 'view',
    span: 'view',
    a: {
        tag: 'navigator',
        href: 'url'
    },
    img: 'image'
};

const defaultComponentTags = {
    customComponentTags: ['model-component']
};

/**
 * 获取默认的swan插件配置，使用函数形式避免缓存
 *
 * @return {Object} plugins config 默认swan的syntax-plugin,tag-transform-plugin,ref-plugin
 */
const getDefaultPlugins = function () {
    return [
        vueSyntax,
        swanSyntax,
        swanEventPlugin,
        [swanModelPlugin, defaultComponentTags],
        html,
        ref
    ];
};

/**
 * 获取默认的swan插件配置，使用函数形式避免缓存
 *
 * @return {Object} plugins config
 */
const getDefaultWXPlugins = function () {
    return [
        vueSyntax,
        wxSyntax,
        wxEventPlugin,
        [wxModelPlugin, defaultComponentTags],
        html,
        ref
    ];
};

/**
 * 获取默认的tt插件配置，使用函数形式避免缓存
 *
 * @return {Object} plugins config
 */
const getDefaultTTPlugins = function () {
    return [
        vueSyntax,
        ttSyntax,
        ttEventPlugin,
        [ttModelPlugin, defaultComponentTags],
        html,
        ref
    ];
};

/**
 * 获取默认的ant插件配置，使用函数形式避免缓存
 *
 * @return {Object} plugins config
 */
const getDefaultAntPlugins = function () {
    return [
        vueSyntax,
        antSyntax,
        antEventPlugin,
        [antModelPlugin, defaultComponentTags],
        html,
        ref
    ];
};

const PLUGIN_MAP = {
    swan: getDefaultPlugins,
    wx: getDefaultWXPlugins,
    ant: getDefaultAntPlugins,
    tt: getDefaultTTPlugins
};

/**
 * 构造模板解析器的配置
 *
 * @param {Object} tagNames  标签配置
 * @param {Object} myPlugins 处理器插件, 默认 swan的syntax-plugin,tag-transform-plugin,ref-plugin
 * @param {string} appType 小程序类型
 * @return {Object} 返回配置
 */
const fakeProcessorOptions = function (tagNames, myPlugins, appType = 'swan') {
    const initConfig = initBuildOption(appType, {}, {});

    let plugins = myPlugins ? myPlugins : PLUGIN_MAP[appType]();

    return {
        appType,
        logger: logger.create({
            prefix: 'okam',
            level: 'debug'
        }),
        root: path.join(__dirname, '..'),
        config: {
            framework: ['data', 'model'],
            template: {
                transformTags: tagNames || defaultTags
            },
            plugins
        },
        output: initConfig.output
    };
};

exports.fakeProcessorOptions = fakeProcessorOptions;

exports.getTemplateEventPlugin = function (appType) {
    switch (appType) {
        case 'swan':
            return swanEventPlugin;
        case 'wx':
            return wxEventPlugin;
        case 'ant':
            return antEventPlugin;
    }
};

exports.readFile = function (filePath) {
    return fs.readFileSync(path.join(__dirname, '../fixtures', filePath)).toString();
};

exports.writeFile = function (data, filePath) {
    fs.writeFileSync(path.join(__dirname, '../fixtures', filePath), data);
};
