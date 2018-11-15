/**
 * @file eptl
 * @author xiaohong8023@outlook.com
 */

const path = require('path');
const etpl = require('etpl');
const fs = require('fs-extra');

class Etpl {
    constructor() {
        this.etplEngine = new etpl.Engine({
            strip: true,
            commandOpen: '<%',
            commandClose: '%>'
        });
    }

    renderEtplByloadFromFile(file, data) {
        let mainRenderer = this.etplEngine.loadFromFile(
            path.resolve(__dirname, file)
        );
        return mainRenderer(data);
    }

    copyEtplResultToFile(filePath, content) {
        fs.ensureFileSync(filePath);
        // 异步
        fs.outputFile(filePath, content);
    }

    renderTplToFile(formPath, toPath, data) {
        let content = this.renderEtplByloadFromFile(formPath, data);
        this.copyEtplResultToFile(toPath, content);
    }
}

module.exports = Etpl;
