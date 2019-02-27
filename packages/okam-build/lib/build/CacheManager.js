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
        this.localCache = null;
        this.cacheDir = options.cacheDir || path.join(helper.getUserHomeDir(), '.okam');
        this.localCacheFile = '.meta';
    }

    setProjectCreateTime(projectId, timestamp) {
        this.localCache.projectInfo[projectId] = {createTime: timestamp};
        this.cacheFile(JSON.stringify(this.localCache), this.localCacheFile);
    }

    getProjectInfo(projectId) {
        if (!this.localCache) {
            let content = this.readCacheFile(this.localCacheFile);
            if (content) {
                try {
                    content = JSON.parse(content.toString());
                }
                catch (ex) {
                    content = null;
                }
            }

            content || (content = {projectInfo: {}});
            this.localCache = content;
        }
        return this.localCache.projectInfo[projectId];
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
