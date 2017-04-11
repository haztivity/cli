"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
var extend = require("extend");
//import {JspmUtils} from "@sokka/gulp-build-tasks/JspmUtils";
var BaseTask_1 = require("@sokka/gulp-build-tasks/libs/tasks/BaseTask");
var ConfigService_1 = require("../../ConfigService");
var path = require("path");
var notify = require("node-notifier");
var gulpStreamToPromise = require("gulp-stream-to-promise");
var q = require("q");
var jspm = require("jspm");
var gulpSync = require("gulp-sync");
var haztivityCliConfig = ConfigService_1.ConfigService.getInstance().getConfig();
/**
 * @class DiscTask
 * @extends BaseTask
 * @description Tarea de distribución
 */
var DistTask = (function (_super) {
    __extends(DistTask, _super);
    function DistTask(options) {
        var _this = _super.call(this) || this;
        _this._name = "dist";
        _this._nodeNotify = notify;
        _this._gulpStreamToPromise = gulpStreamToPromise;
        _this._q = q;
        _this._options = _this._joinOptions(options);
        _this._jspmUtils = jspm; //JspmUtils.getInstance();
        return _this;
    }
    DistTask.prototype._getDefaults = function () {
        return DistTask.DEFAULTS;
    };
    /**
     * Genera el bundle mediante jspm
     * @param {IRunConfig}  options Configuración a aplicar
     * @private
     */
    DistTask.prototype._makeBundle = function (options) {
        //todo resolve src path
        var defer = this._q.defer(), src = this._path.join(this._options.src.path, this._options.bundle.src), dest = this._path.join(this._options.dest.path, this._options.bundle.dest);
        try {
            this._jspmUtils.bundleSFX(src, dest, options).then(this._onBundleSuccess.bind(this, defer)).catch(this._onDistFail.bind(this, defer));
        }
        catch (e) {
            this._onDistFail(defer, e);
        }
        return defer.promise;
    };
    /**
     * Invocado al finalizarse la tarea satisfactoriamente
     * @private
     */
    DistTask.prototype._onDistSuccess = function (cb) {
        this._nodeNotify.notify({
            title: this._name,
            message: "Bundle sfx created"
        });
        cb();
    };
    /**
     * Invocado al fallar la tarea
     * @param err
     * @private
     */
    DistTask.prototype._onDistFail = function (defer, err) {
        this._nodeNotify.notify({
            title: this._name,
            message: err.stack
        });
        defer.reject(err);
        throw err;
    };
    /**
     * Invocado al generarse el bundle satisfactoriamente
     * @private
     */
    DistTask.prototype._onBundleSuccess = function (defer) {
        defer.resolve();
    };
    DistTask.prototype._copy = function (files, dest) {
        var stream = this._vfs.src(files)
            .pipe(this._gulpPlumber({ errorHandler: this._gulpNotifyError() })) //notifyError generates the config
            .pipe(this._options.verbose
            ? this._gulpDebug({ title: this._getLogMessage("Files") })
            : this._gutil.noop()).pipe(this._vfs.dest(dest.path, dest.options));
        var promise = this._gulpStreamToPromise(stream);
        return promise;
    };
    /**
     * Resolve the path of the files to watch prepending the src
     * @returns {Array}
     * @private
     */
    DistTask.prototype._resolveFiles = function (files) {
        var result = [], src = this._options.base;
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            result.push(this._path.join(src, file));
        }
        return result;
    };
    //make bundle
    //copy dependencies
    //copy others
    DistTask.prototype.run = function (cb, options) {
        if (options === void 0) { options = {}; }
        var defer = this._q.defer();
        var _options = this._extend(true, {}, this._options.bundle.options || {}, options);
        var bundlePromise = this._makeBundle(_options);
        var copyPromise = this._copy(this._resolveFiles(this._options.bundle.copy), {
            path: this._options.dest.path
        });
        this._q.all([bundlePromise, copyPromise]).then(this._onDistSuccess.bind(this, cb)).catch(this._onDistFail.bind(this, defer));
    };
    /**
     * Register the tasks
     * @param gulp
     * @param task
     */
    DistTask.registerTasks = function (gulp) {
        var gulpSyncronizer = gulpSync(gulp);
        var config = ConfigService_1.ConfigService.getInstance().getConfig();
        var task = new DistTask(config);
        var name = task._name.toLowerCase();
        gulp.task("_" + name, function (cb) {
            return task.run(cb);
        });
        gulp.task("dist", gulpSyncronizer.sync([
            'clear',
            //["typescript:build","sass:build"],
            "_" + name
        ]));
    };
    ;
    return DistTask;
}(BaseTask_1.BaseTask));
//extend from defaults of BaseTask
DistTask.DEFAULTS = extend(true, {}, BaseTask_1.BaseTask.DEFAULTS, {
    src: path.join(haztivityCliConfig.src.path, "index.js"),
    dest: path.join(haztivityCliConfig.dest.path, "index.js"),
    options: {
        mangle: false,
        minify: false,
        lowResSourceMaps: true,
        sourceMaps: true
    },
    copy: [],
    notify: {
        success: {
            timeout: 2000,
            sound: false,
            onLast: true
        },
        error: {
            timeout: 5000,
            sound: true,
            onLast: true
        }
    }
});
exports.DistTask = DistTask;
