/**
 * @file npm processor helper
 *
 * @author xiaohong8023@outlook.com
 */

const DEP_DIR_NAME = 'node_modules';
const DEP_DIR_NAME_REGEXP = new RegExp(DEP_DIR_NAME, 'g');
const NEW_DEP_DIR_NAME = 'npm';


function isNpmModuleFile(modulePath) {
    return modulePath.indexOf(DEP_DIR_NAME) === 0;
}

function resolveNpmModuleNewPath(oldPath, rebaseDepDir) {
    let newPath = rebaseDepDir + oldPath.substr(DEP_DIR_NAME.length + 1);
    // replace all `node_modles` to `npm` to fix weixin cannot find the module
    // if the module path exists `node_module` dir name
    return nodeModulesToNpm(newPath);
}

function nodeModulesToNpm(path) {
    // replace all `node_modles` to `npm` to fix weixin cannot find the module
    // if the module path exists `node_module` dir name
    return path.replace(DEP_DIR_NAME_REGEXP, NEW_DEP_DIR_NAME);
}


module.exports = exports = {
    isNpmModuleFile,
    resolveNpmModuleNewPath,
    nodeModulesToNpm
};
