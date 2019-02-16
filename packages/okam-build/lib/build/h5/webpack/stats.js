/**
 * @file Stats helper
 * @author sparklewhy@gmail.com
 */

'use strict';

const fs = require('fs');
const path = require('path');
const {colors} = require('../../../util');

const isJS = val => /\.js$/.test(val);
const isCSS = val => /\.css$/.test(val);
const isImg = val => /\.(jpe?g|png|webp|gif)$/.test(val);

function formatSize(size) {
    return (size / 1024).toFixed(2) + ' KiB';
}

function getGzipSize(asset, dir) {
    const zlib = require('zlib');
    const buffer = fs.readFileSync(path.join(dir, asset.name));
    return formatSize(zlib.gzipSync(buffer).length);
}

function sortAssetFiles(assets) {
    const seenNames = new Map();
    return assets
        .filter(a => {
            if (seenNames.has(a.name)) {
                return false;
            }
            seenNames.set(a.name, true);
            return true;
        })
        .sort((a, b) => {
            const isAJs = isJS(a.name);
            const isACss = isCSS(a.name);
            const isBJs = isJS(b.name);
            const isBCss = isCSS(b.name);
            const isAOtherType = !isAJs && !isACss;
            const isBOtherType = !isBJs && !isBCss;

            if (isAOtherType && !isBOtherType) {
                return 1;
            }

            if (isBOtherType && !isAOtherType) {
                return -1;
            }

            if (isAJs && isBCss) {
                return -1;
            }

            if (isACss && isBJs) {
                return 1;
            }

            return b.size - a.size;
        });
}

function makeRow(a, b, c) {
    return `  ${a}\t    ${b}\t ${c}`;
}

function formatFileName(asset, outputDirName) {
    let filePath = path.join(outputDirName, asset.name);
    if (isJS(filePath)) {
        return colors.green(filePath);
    }

    if (isCSS(filePath)) {
        return colors.cyan(filePath);
    }

    if (isImg(filePath)) {
        return colors.yellow(filePath);
    }

    return colors.blue(filePath);
}

/**
 * Format stats info, extracted from @vue/cli-service
 *
 * @param {Object} stats the webpack compile result stats
 * @param {string} outputDir the output dir
 * @return {string}
 */
exports.formatStats = function (stats, outputDir) {
    const ui = require('cliui')({width: 80});

    const json = stats.toJson({
        hash: false,
        modules: false,
        chunks: false
    });

    let assets = json.assets
        ? json.assets
        : json.children.reduce((acc, child) => acc.concat(child.assets), []);
    assets = sortAssetFiles(assets);

    const outputDirName = path.basename(outputDir);
    const assetStatsInfo = assets.map(asset => makeRow(
        formatFileName(asset, outputDirName),
        formatSize(asset.size),
        getGzipSize(asset, outputDir)
    )).join('\n');
    ui.div(
        makeRow(
            colors.cyan.bold('File'),
            colors.cyan.bold('Size'),
            colors.cyan.bold('Gzip size')
        ) + '\n\n' + assetStatsInfo
    );

    return `${ui.toString()}\n\n`;
};
