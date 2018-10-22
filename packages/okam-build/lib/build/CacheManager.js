/**
 * @file Build cache manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const {helper, file: fileUtil} = require('../util');

class CacheManager {
    constructor(options) {
        this.memCache = {
            dirFileInfo: {}
        };
        this.cacheDir = options.cacheDir || path.join(helper.getUserHomeDir(), '.okam');
    }

    setDirFileListInfo(dir, info) {
        this.memCache.dirFileInfo[dir] = info;
    }

    getDirFileListInfo(dir) {
        return this.memCache.dirFileInfo[dir];
    }

    clearDirFileListInfo(dir) {
        let cacheInfo = this.memCache.dirFileInfo;
        if (cacheInfo.hasOwnProperty(dir)) {
            delete cacheInfo[dir];
        }
    }

    getCacheDir() {
        return this.cacheDir;
    }

    /**
     * Cache file content
     *
     * @param {string|Buffer} content the content to cache
     * @param {string} relPath the cache file path relative to the cache root dir
     */
    cacheFile(content, relPath) {
        let filePath = path.join(this.cacheDir, relPath);
        mkdirp.sync(path.dirname(filePath));

        fs.writeFileSync(filePath, content);
    }

    /**
     * Read the cache file content, if not found, return undefined
     *
     * @param {string} relPath the cache file path relative to the cache root dir
     * @return {?Buffer}
     */
    readCacheFile(relPath) {
        let filePath = path.join(this.cacheDir, relPath);

        if (fileUtil.isFileExists(filePath)) {
            return fs.readFileSync(filePath);
        }
    }
}

module.exports = exports = CacheManager;
