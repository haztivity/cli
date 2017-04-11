/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as extend from "extend";
//import {JspmUtils} from "@sokka/gulp-build-tasks/JspmUtils";
import {BaseTask, IProcessParams, ITaskOptions,ITaskDestOptions} from "@sokka/gulp-build-tasks/libs/tasks/BaseTask";
import {ConfigService,HaztivityCliConfig} from "../../ConfigService";
import * as path from "path";
import * as notify from "node-notifier";
import * as gulpClean from "gulp-clean";
const haztivityCliConfig = ConfigService.getInstance().getConfig();
export class ClearTask extends BaseTask{
    public static readonly NAME = "clear";
    protected _name: string = "Clear";
    protected _gulpClean = gulpClean;
    protected _options:HaztivityCliConfig;
    constructor(options:HaztivityCliConfig){
        super();
        this._options = this._joinOptions(options);
    }
    public run(){
        return this._gulp.src(this._options.dest.path)
            .pipe(this._gulpClean({force: true}));
    }
}