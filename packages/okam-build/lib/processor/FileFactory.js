/**
 * @file the file object to process
 * @author sparklewhy@gmail.com
 */

'use strict';

const path = require('path');
const fs = require('fs');
const Readable = require('stream').Readable;
const {
    FILE_EXT_PROCESSOR,
    isScript: isScriptType,
    isTemplate: isTplType,
    isStyle: isStyleType,
    isJSON: isJsonType,
    isImg: isImgType
} = require('./type');
const relative = require('../util').file.relative;

const {isNpmModuleFile, resolveNpmModuleNewPath} = require('./helper/npm');

function loadFileContent() {
    if (this._data) {
        return this._data;
    }

    if (!this.rawContent) {
        this.rawContent = fs.readFileSync(this.fullPath);
    }
    return this.rawContent;
}

function updateFileContent(content) {
    this._data = content;
}

function addDeps(deps) {
    this.deps || (this.deps = []);
    if (!Array.isArray(deps)) {
        deps = [deps];
    }

    let currDeps = this.deps;
    deps.forEach(item => {
        if (item && !currDeps.includes(item)) {
            currDeps.push(item);
        }
    });
}

/**
 * 从源文件派生出来的子文件，典型比如 Component 文件可以派生出脚本、模板、样式等子文件
 *
 * @param {Object} file the subFile to add
 */
function addSubFile(file) {
    if (!file) {
        return;
    }

    this.subFiles || (this.subFiles = []);
    if (!this.subFiles.includes(file)) {
        file.isSubFile = true;
        file.owner = this;
        this.subFiles.push(file);
    }
}

function resetFile() {
    if (this.processing) {
        return;
    }

    this.subFiles && (this.subFiles = []);
    this.deps && (this.deps = []);
    this.compiled = false;
    this.refs && (this.refs = null);
    this.resolvedModIds && (this.resolvedModIds = null);
    if (this.isAnalysedComponents) {
        this.isAnalysedComponents = false;
    }

    if (this.isSubFile) {
        this.content = this.rawContent;
    }
    else {
        this.rawContent = null;
        this.content = null;
        this.ast && (this.ast = null);
    }
}

function getFileStream() {
    if (!this._data && !this.rawContent) {
        return fs.createReadStream(this.fullPath);
    }

    let content = this._data || this.rawContent;
    let stream = new Readable();
    stream.push(content);
    stream.push(null);
    return stream;
}

/**
 * Create file info object
 *
 * @param {Object} fileInfo the file to create
 * @param {string=} fileInfo.fullPath the file absolute path
 * @param {string=} fileInfo.path the relative path relative to rootDir
 * @param {boolean=} fileInfo.isVirtual whether a virtual file, optional, by default false
 * @param {*=} fileInfo.data the file content, optional
 * @param {string} rootDir the root directory
 * @return {Object}
 */
function createFile(fileInfo, rootDir) {
    let {path: relPath, fullPath, data, isVirtual, isScript, isStyle, isTemplate} = fileInfo;
    if (relPath && !fullPath) {
        fullPath = path.resolve(rootDir, relPath);
    }

    let extname = path.extname(fullPath).slice(1).toLowerCase();
    let vf = {
        processor: FILE_EXT_PROCESSOR[extname],
        dirname: path.dirname(fullPath),
        extname,
        fullPath,
        path: relPath || relative(fullPath, rootDir),
        rawContent: data,
        isVirtual,
        isScript: isScript == null ? isScriptType(extname) : isScript,
        isStyle: isStyle == null ? isStyleType(extname) : isStyle,
        isImg: isImgType(extname),
        isTpl: isTemplate == null ? isTplType(extname) : isTemplate,
        isJson: isJsonType(extname),
        addDeps,
        addSubFile,
        reset: resetFile,
        sourceMap: null
    };

    Object.defineProperties(vf, {
        stream: {
            get: getFileStream
        },
        content: {
            get: loadFileContent,
            set: updateFileContent
        }
    });

    return vf;
}

function isFileExist(file) {
    return !!this._existMap[typeof file === 'string' ? file : file.fullPath];
}

class FileFactory {

    /**
     * Create FileFactory instance
     *
     * @param {Object} options create options
     */
    constructor(options) {
        this._files = [];
        this._existMap = {};

        let {root, rebaseDepDir} = options;
        this.root = root;

        if (rebaseDepDir && !/\/$/.test(rebaseDepDir)) {
            rebaseDepDir += '/';
        }

        this.rebaseDepDir = rebaseDepDir;
        Object.defineProperties(this, {
            length: {
                get() {
                    return this._files.length;
                }
            }
        });
    }

    getFileList() {
        return this._files;
    }

    getRelativePath(fullPath) {
        return relative(fullPath, this.root);
    }

    /**
     * Add new file
     *
     * @param {string|Object} f the full path or the file object to add
     * @param {boolean=} isUnshift whether unshift the new file to the current
     *        file list
     * @return {Object}
     */
    addFile(f, isUnshift = false) {
        if (typeof f === 'string') {
            let relPath = this.getRelativePath(f);
            let file = this._existMap[relPath];
            if (file) {
                return file;
            }
            f = createFile({fullPath: f, path: relPath}, this.root);
        }
        else {
            f = createFile(f, this.root);
        }

        let result = isUnshift ? this.unshift(f) : this.push(f);
        if (result && isNpmModuleFile(f.path)) {
            f.isNpm = true;
            if (this.rebaseDepDir) {
                f.resolvePath = resolveNpmModuleNewPath(
                    f.path, this.rebaseDepDir
                );
            }
        }
        return f;
    }

    unshift(f) {
        let existed = this._existMap[f.path];
        if (existed) {
            return false;
        }
        this._existMap[f.path] = f;
        this._files.unshift(f);
        return true;
    }

    push(f) {
        let existed = this._existMap[f.path];
        if (existed) {
            return false;
        }
        this._existMap[f.path] = f;
        this._files.push(f);
        return true;
    }

    getByFullPath(fullPath) {
        let relPath = this.getRelativePath(fullPath);
        return this._existMap[relPath];
    }

    getByPath(relPath) {
        return this._existMap[relPath];
    }

    createFile(f) {
        return createFile(f, this.root);
    }

    forEach(handler) {
        this._files.forEach(handler);
    }

    map(handler) {
        return this._files.map(handler);
    }

    size() {
        return this._files.length;
    }

    hasDep(depFilePath, file, processed) {
        let {path, deps, subFiles} = file;
        if (processed[path]) {
            return false;
        }
        processed[path] = true;

        let depList = deps || [];
        for (let i = 0, len = depList.length; i < len; i++) {
            let depPath = depList[i];
            let depFile = depPath;
            if (typeof depPath === 'string') {
                depFile = this.getByPath(depPath);
            }
            else {
                depPath = depFile.path;
            }

            if (!depFile) {
                continue;
            }

            if (depFilePath === depPath
                || this.hasDep(depFilePath, depFile, processed)
            ) {
                return true;
            }
        }

        return (subFiles || []).some(
            item => this.hasDep(
                depFilePath, item, processed
            )
        );
    }

    getFilesByDep(depFilePath) {
        let files = this._files;
        let result = [];
        let processed = {};
        files.forEach(
            item => {
                if (this.hasDep(depFilePath, item, processed)) {
                    result.push(item);
                }
            }
        );

        return result;
    }
}

FileFactory.prototype.exists = FileFactory.prototype.includes = isFileExist;

FileFactory.createFile = createFile;

module.exports = exports = FileFactory;
