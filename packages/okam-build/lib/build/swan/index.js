/**
 * @file Baidu swan mini program build task manager
 * @author sparklewhy@gmail.com
 */

'use strict';

const BuildManager = require('../BuildManager');
const initWx2SwanProcessor = require('./init-wx2swan-processor');
const {initFrameworkInfo} = require('./build-info');
const {md5} = require('../../util').helper;

class BuildSwanAppManager extends BuildManager {

    /**
     * @override
     */
    initProcessor(buildConf) {
        super.initProcessor(buildConf);

        const defaultBabelProcessorName = this.defaultBabelProcessorName;

        // register wx2swan processors
        let wx2swanOpts = buildConf.wx2swan;
        if (wx2swanOpts) {
            initWx2SwanProcessor(wx2swanOpts, defaultBabelProcessorName);
        }
    }

    /**
     * @override
     */
    loadFiles() {
        super.loadFiles();

        let projectId = md5(this.root);
        let projectInfo = this.cache.getProjectInfo(projectId);

        return initFrameworkInfo(this.root, projectInfo).then(res => {
            let {file, frameworkInfo} = res;
            let ctime = frameworkInfo.createTime;

            if (!projectInfo || (ctime !== '' + projectInfo.createTime)) {
                this.cache.setProjectCreateTime(projectId, ctime);
            }

            file.allowRelease = true;
            this.files.push(file);
        });
    }
}

module.exports = BuildSwanAppManager;
