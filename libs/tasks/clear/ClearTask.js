"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import {JspmUtils} from "@sokka/gulp-build-tasks/JspmUtils";
const BaseTask_1 = require("@sokka/gulp-build-tasks/libs/tasks/BaseTask");
const ConfigService_1 = require("../../ConfigService");
const gulpClean = require("gulp-clean");
const haztivityCliConfig = ConfigService_1.ConfigService.getInstance().getConfig();
class ClearTask extends BaseTask_1.BaseTask {
    constructor(options) {
        super();
        this._name = "clear";
        this._gulpClean = gulpClean;
        this._options = this._joinOptions(options);
    }
    run() {
        return this._gulp.src(this._options.dest.path)
            .pipe(this._gulpClean({ force: true }));
    }
}
exports.ClearTask = ClearTask;
//# sourceMappingURL=ClearTask.js.map