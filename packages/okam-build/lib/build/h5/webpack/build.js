/**
 * @file Build h5 app based on webpack
 * @author sparklewhy@gmail.com
 */

'use strict';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {colors, logger: defaultLogger} = require('../../../util');
const net = require('../../../server/net');

const DEFAULT_UNKNOWN_HOST = '0.0.0.0';
const DEFAULT_PORT = 8080;

function getDevServerConfig(isDev, devServer) {
    return Object.assign({
        clientLogLevel: 'warning',
        historyApiFallback: false,
        hot: isDev, // enable hmr
        contentBase: false, // since we use CopyWebpackPlugin.
        watchContentBase: false,
        compress: !isDev,
        index: 'index.html', // the index file
        open: false, // auto open browser
        publicPath: '/',
        overlay: {warnings: false, errors: true},
        quiet: true // necessary for FriendlyErrorsPlugin
    }, devServer);
}

function getBuildSuccessMessages(isDev, serverConf, homePath) {
    const messages = [];

    if (isDev) {
        const buildCommand = 'npm run prod:h5';
        messages.push('Note that the development build is not optimized.');
        messages.push(`To create a production build, run ${colors.cyan(buildCommand)}.`);
    }
    else {
        messages.push('App is served in production mode.');
    }

    if (serverConf) {
        let {host, port, publicPath} = serverConf;
        host === DEFAULT_UNKNOWN_HOST && (host = 'localhost');
        const urlPath = `${publicPath || '/'}#${homePath || '/'}`;
        const url = colors.cyan(`http://${host}:${port}${urlPath}`);
        const netUrl = colors.cyan(`http://${net.getIP()}:${port}${urlPath}`);
        messages.push();
        messages.push('App running at:');
        messages.push(`- Local:  ${url}`);
        messages.push(`- Network: ${netUrl}`);
    }
    messages.push();

    return messages;
}

function initDevServerOptions(isDev, webpackConf) {
    const serverOpts = webpackConf.devServer;
    if (!serverOpts) {
        return;
    }

    webpackConf.devServer = getDevServerConfig(isDev, serverOpts);
    const devServerOpts = webpackConf.devServer;
    devServerOpts.host = devServerOpts.host || DEFAULT_UNKNOWN_HOST;
    devServerOpts.port = devServerOpts.port || DEFAULT_PORT;
}

function getWebpackConfig(isDev, options) {
    let customWebpackConf = Object.assign({}, options.webpack);
    if (!customWebpackConf.hasOwnProperty('sourceMap')) {
        customWebpackConf.sourceMap = isDev;
    }

    if (!customWebpackConf.root) {
        customWebpackConf.root = options.sourceDir;
    }

    // init dev server options
    initDevServerOptions(isDev, customWebpackConf);
    const devServerOpts = customWebpackConf.devServer;

    // init webpack config
    let webpackConfig = isDev
        ? require('./webpack.dev.conf')
        : require('./webpack.prod.conf');
    webpackConfig = webpackConfig(customWebpackConf);

    // inject dev server entry script and middlewares
    if (devServerOpts) {
        let devServerMws = options.devServerMws;
        if (devServerMws && devServerMws.length) {
            devServerOpts.before = (app, server) => {
                devServerMws.forEach(item => app.use(item));
            };
        }

        WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOpts);
    }

    return webpackConfig;
}

/**
 * Build h5 app
 *
 * @param {boolean} isDev whether is dev mode
 * @param {Object} options the build options
 * @param {string} options.root the project root
 * @param {string} options.sourceDir the build output source dir
 * @param {Array=} options.devServerMws the middewares of the dev server
 * @param {Object=} options.webpack the custom webpack build config, the detail
 *        option please refer webpack.base.conf.js
 * @param {string=} options.homePath the home page path
 * @param {Object=} logger the logger util
 * @return {Promise}
 */
function buildH5App(isDev, options, logger) {
    logger || (logger = defaultLogger.create({
        prefix: 'okam'
    }));

    const webpackConfig = getWebpackConfig(isDev, options, logger);
    const devServerOpts = webpackConfig.devServer;
    delete webpackConfig.devServer;

    // create compiler
    const compiler = webpack(webpackConfig);

    // enable progress
    new webpack.ProgressPlugin().apply(compiler);

    // create dev server
    let server;
    if (devServerOpts) {
        server = new WebpackDevServer(compiler, devServerOpts);
    }
    else {
        compiler.run((err, stats) => {
            logger.info('Webpack compile done');
            let statsInfo = require('./stats').formatStats(
                stats, webpackConfig.output.path
            );
            console.log(`\n${statsInfo}`);
        });
    }

    ['SIGINT', 'SIGTERM'].forEach(signal => {
        process.on(
            signal,
            () => {
                if (server) {
                    server.close(() => process.exit(0));
                }
                else {
                    process.exit(0);
                }
            }
        );
    });

    server && server.listen(devServerOpts.port, devServerOpts.host, err => {
        if (err) {
            logger.error(
                `start webpack dev server ${devServerOpts.host}:${devServerOpts.port} error`,
                err.stack || err
            );
        }
    });

    let isFirstCompile = true;
    return new Promise((resolve, reject) => {
        compiler.hooks.done.tap('ProgressPlugin', stats => {
            try {
                if (!stats.hasErrors() && isFirstCompile) {
                    isFirstCompile = false;
                    let msgs = getBuildSuccessMessages(
                        isDev, devServerOpts, options.homePath
                    );
                    msgs.forEach(item => {
                        logger.info(item);
                    });
                }
                resolve();
            }
            catch (ex) {
                reject(ex);
            }
        });
    });
}

module.exports = buildH5App;
