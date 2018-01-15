"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fse = require("fs-extra");
const glob = require("glob");
const Logger_1 = require("../../logger/Logger");
class ClonePageTask {
    constructor(options) {
        this.options = options;
        this._logger = Logger_1.Logger.getInstance();
    }
    run() {
        let clone = path.normalize(this.options.clone), to = path.normalize(this.options.to);
        if (!fse.pathExistsSync(clone)) {
            throw "Clone path doesn't exists:" + clone;
        }
        if (!!path.extname(clone)) {
            throw "The origin must be a directory";
        }
        if (!!path.extname(to)) {
            throw "The target must be a directory";
        }
        fse.ensureDirSync(to);
        if (this.options.force != true && fse.readdirSync(to).length > 0) {
            throw "The target must be an empty folder. To overwrite existing files use 'force' option";
        }
        fse.copySync(clone, to, { overwrite: true, recursive: true });
        const originName = clone.split(path.sep).pop();
        const name = to.split(path.sep).pop();
        //get .ts,.js,.css,.scss
        const files = glob.sync(to + "/*.{ts,js,scss,stylus,less,css,mustache,pug,html,json}", { nodir: true });
        const regexp = new RegExp(originName, "gm");
        for (let file of files) {
            try {
                this._logger.info(`Replacing '${originName}' for '${name}' in ${path.basename(file)}`);
                let content = fse.readFileSync(file, 'utf8');
                content = content.replace(regexp, name);
                fse.writeFileSync(file, content, "utf8");
            }
            catch (e) {
                this._logger.error(`Error updating file ${file}`, e);
            }
        }
    }
}
exports.ClonePageTask = ClonePageTask;
//# sourceMappingURL=ClonePageTask.js.map