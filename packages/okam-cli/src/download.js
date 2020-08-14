/**
 * @file download.js
 * @author xiaohong8023@outlook.com
 *
 * templates: https://github.com/awesome-okam/okam-online-templates/tree/master/templates
 */

const download = require('download');

const zipsDir = 'https://raw.githubusercontent.com/awesome-okam/okam-online-templates/master/zips';

module.exports = {

    /**
     * download official template zip
     *
     * @param  {string} templateName templateName
     * @param  {string} dist     dist
     * @param  {Object} options  options
     * @return {Object}
     */
    downloadOfficialZip(templateName, dist, options) {
        return download(`${zipsDir}/${templateName}.zip`, dist, options);
    }
};
