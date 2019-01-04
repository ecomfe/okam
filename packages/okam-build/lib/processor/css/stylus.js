/**
 * @file The stylus processor
 * @author sparklewhy@gmail.com
 */

'use strict';

const stylus = require('stylus');

module.exports = function (file, options) {
    let config = options.config;
    config = Object.assign({
        filename: file.fullPath
    }, config);

    // init the paths to search
    let confPaths = config.paths || [];
    [file.dirname].forEach(item => {
        if (!confPaths.includes(item)) {
            confPaths.push(item);
        }
    });
    config.paths = confPaths;

    let stylusUse = config.use;
    delete config.use;

    // http://stylus-lang.com/docs/js.html#stylusresolveroptions
    let defineOpt = config.define || {url: stylus.resolver()};
    delete config.define;

    let compiler = stylus(file.content.toString());
    Object.keys(config).forEach(key => {
        compiler.set(key, config[key]);
    });
    compiler.use(function (style) {
        if (typeof stylusUse === 'function') {
            stylusUse(style);
        }

        defineOpt && Object.keys(defineOpt).forEach(name => {
            style.define(name, defineOpt[name]);
        });
    });

    let deps = compiler.deps() || [];
    let result;
    compiler.render((err, css) => {
        if (err) {
            throw err;
        }
        result = css.toString();
    });

    return {
        content: result,
        deps: deps
    };
};
