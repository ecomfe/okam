/**
 * @file File change monitor
 * @author sparklewhy@gmail.com
 */

'use strict';

const chokidar = require('chokidar');
const EventEmitter = require('events');
const eventUtil = require('../util').event;

const FILE_WATCH_EVENT_MAP = {
    ready: '',
    change: 'fileChange',
    add: 'fileAdd',
    addDir: 'dirAdd',
    unlink: 'fileDel',
    unlinkDir: 'dirDel',
    error: '',
    raw: ''
};

function getProxyEventHandler(watcher, eventType) {
    return function (file) {
        watcher.emit('watch', eventType, file.replace(/\\/g, '/'));
        watcher.emit(eventType, file);
    };
}

class FileWatcher extends EventEmitter {

    /**
     * Create FileWatcher instance
     *
     * @param {Object} options the options to create instance
     * @param {string} options.baseDir the base directory of the watch files
     * @param {Array.<string>} options.files the files to watch
     * @param {Object=} options.opts the watch options
     */
    constructor(options) {
        super();

        let {files, opts, baseDir} = options || {};
        this.baseDir = baseDir || '.';
        this.watchOpts = opts;
        this.initWatchFiles(files);
    }

    initEventListener() {
        let proxyEvents = {};
        Object.keys(FILE_WATCH_EVENT_MAP).forEach(eventName => {
            let newEventName = FILE_WATCH_EVENT_MAP[eventName];
            if (newEventName) {
                newEventName = getProxyEventHandler(this, newEventName);
            }
            proxyEvents[eventName] = newEventName;
        });
        eventUtil.proxyEvents(
            this._watcher, this, proxyEvents
        );
    }

    initWatchFiles(files) {
        files || (files = []);

        if (!Array.isArray(files)) {
            files = [files];
        }

        this.watchFiles = files.filter(path => {
            if (path.startsWith('node_modules/')) {
                return false;
            }
            return true;
        });
    }

    /**
     * Add new file path or file path list to watch
     *
     * @param {string|Array} file the file to watch
     */
    add(file) {
        if (!Array.isArray(file)) {
            file = [file];
        }

        let newWatchFiles = [];
        let watchFiles = this.watchFiles;
        file.forEach(item => {
            let found = watchFiles.indexOf(item);
            if (found === -1) {
                watchFiles.push(file);
                newWatchFiles.push(file);
            }
        });

        if (newWatchFiles.length && this._watcher) {
            this._watcher.add(newWatchFiles);
        }
    }

    /**
     * The file path or file path list to unwatch
     *
     * @param {string|Array} file the file to unwatch
     */
    remove(file) {
        if (!Array.isArray(file)) {
            file = [file];
        }

        let watchFiles = this.watchFiles;
        let removeFiles = [];
        for (let i = watchFiles.length - 1; i >= 0; i--) {
            let found = file.indexOf(watchFiles[i]);
            if (found !== -1) {
                watchFiles.splice(i, 1);
                removeFiles.push(file);
            }
        }

        if (removeFiles.length && this._watcher) {
            this._watcher.unwatch(removeFiles);
        }
    }

    /**
     * Start the file change watch
     */
    start() {
        if (this._watcher) {
            return;
        }

        this._watcher = chokidar.watch(this.watchFiles, Object.assign({
            ignoreInitial: true,
            cwd: this.baseDir
        }, this.watchOpts));
        this.initEventListener();
    }

    /**
     * Restart file change watch
     *
     * @param {Array.<string>=} files the files to watch
     */
    restart(files) {
        this.close();

        this.emit('restart');

        files && (this.initWatchFiles(files));
        this.start();
    }

    /**
     * Close the file watch
     */
    close() {
        if (this._watcher) {
            Object.keys(FILE_WATCH_EVENT_MAP).forEach(k => {
                let event = FILE_WATCH_EVENT_MAP[k];
                this.removeAllListeners(event || k);
            });
            this._watcher.close();
        }
        this._watcher = null;
    }

}

module.exports = exports = FileWatcher;
