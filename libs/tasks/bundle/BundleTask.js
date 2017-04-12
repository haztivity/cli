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
var gulp_build_tasks_1 = require("@sokka/gulp-build-tasks");
var BaseTask_1 = require("@sokka/gulp-build-tasks/libs/tasks/BaseTask");
var ConfigService_1 = require("../../ConfigService");
var gulpHtmlReplace = require("gulp-html-replace");
var notify = require("node-notifier");
var gulpStreamToPromise = require("gulp-stream-to-promise");
var q = require("q");
var Logger_1 = require("@sokka/gulp-build-tasks/libs/Logger");
var haztivityCliConfig = ConfigService_1.ConfigService.getInstance().getConfig();
/**
 * @class DiscTask
 * @extends BaseTask
 * @description Tarea de distribución
 */
var BundleTask = (function (_super) {
    __extends(BundleTask, _super);
    function BundleTask(options) {
        var _this = _super.call(this) || this;
        _this._name = "bundle";
        _this._jspmUtils = gulp_build_tasks_1.JspmUtils.getInstance();
        _this._jspm = _this._jspmUtils.getJspm();
        _this._nodeNotify = notify;
        _this._gulpStreamToPromise = gulpStreamToPromise;
        _this._gulpHtmlReplace = gulpHtmlReplace;
        _this._q = q;
        _this._logger.setLevel(Logger_1.LoggerLevel.verbose);
        _this._options = _this._joinOptions(options);
        return _this;
    }
    BundleTask.prototype._getDefaults = function () {
        return BundleTask.DEFAULTS;
    };
    /**
     * Genera el bundle mediante jspm
     * @param {IRunConfig}  options Configuración a aplicar
     * @private
     */
    BundleTask.prototype._makeBundle = function (options) {
        //todo resolve src path
        var defer = this._q.defer(), promise = defer.promise, src = this._options.bundle.src, dest = this._path.join(this._options.base, this._options.dest, this._options.bundle.dest);
        this._logger.info("JSPM bundle-sfx expression:" + src + ", dest:" + dest);
        try {
            var time = new Date();
            this._jspm.bundleSFX(src, dest, options).then(this._onBundleSuccess.bind(this, defer, time)).catch(this._onDistFail.bind(this, defer));
        }
        catch (e) {
            defer.reject(e);
            this._onDistFail(defer, e);
        }
        return promise;
    };
    /**
     * Invocado al finalizarse la tarea satisfactoriamente
     * @private
     */
    BundleTask.prototype._onDistSuccess = function (cb, time) {
        var timeEnd = new Date();
        var timeSpent = (timeEnd.getTime() - time.getTime()) / 1000;
        this._logger.info("bundle finished after " + timeSpent + "s");
        this._nodeNotify.notify({
            title: this._name,
            message: "Bundle created after " + timeSpent + "s"
        });
        cb();
    };
    /**
     * Invocado al fallar la tarea
     * @param err
     * @private
     */
    BundleTask.prototype._onDistFail = function (defer, err) {
        this._nodeNotify.notify({
            title: this._name,
            message: err.stack
        });
        defer.reject(err);
        this._logger.error(err.message);
    };
    /**
     * Invocado al generarse el bundle satisfactoriamente
     * @private
     */
    BundleTask.prototype._onBundleSuccess = function (defer, time) {
        var timeEnd = new Date();
        this._logger.log("JSPM bundle-sfx created after " + (timeEnd.getTime() - time.getTime()) / 1000 + " s");
        defer.resolve();
    };
    BundleTask.prototype._copy = function (files, dest) {
        this._logger.info("Copying files");
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
    BundleTask.prototype._resolveFiles = function (files) {
        var result = [], base = this._options.base;
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            result.push(this._path.join(base, file));
        }
        return result;
    };
    BundleTask.prototype._replaceSystem = function (files, bundle, dest) {
        this._logger.info("Replazing system scripts in files");
        var stream = this._vfs.src(files)
            .pipe(this._gulpPlumber({ errorHandler: this._gulpNotifyError() })) //notifyError generates the config
            .pipe(this._options.verbose
            ? this._gulpDebug({ title: this._getLogMessage("Files") })
            : this._gutil.noop())
            .pipe(this._gulpHtmlReplace({
            system: "",
            bundle: bundle,
        }, {
            keepUnassigned: false,
            keepBlockTags: false
        }))
            .pipe(this._vfs.dest(dest.path, dest.options));
        var promise = this._gulpStreamToPromise(stream);
        return promise;
    };
    BundleTask.prototype._onBundleAndCopySuccess = function (cb, time, defer) {
        this._replaceSystem([
            this._path.join(this._options.base, this._options.dest, "**/**.html")
        ], this._options.bundle.dest, {
            path: this._path.join(this._options.base, this._options.dest)
        }).then(this._onDistSuccess.bind(this, cb, time)).catch(this._onDistFail.bind(this, defer));
    };
    BundleTask.prototype.run = function (cb, options) {
        if (options === void 0) { options = {}; }
        var defer = this._q.defer(), jspmAvailable = this._jspmUtils.isAvailable();
        if (jspmAvailable == true) {
            var time = new Date();
            var _options = this._extend(true, {}, this._options.bundle.options || {}, options);
            var bundlePromise = this._makeBundle(_options);
            var files = this._resolveFiles(this._options.bundle.copy);
            var toExclude = this._joinExcludeFiles([], { jspm: false, npm: true, bower: true });
            var copyPromise = this._copy(toExclude.concat(files), {
                path: this._path.join(this._options.base, this._options.dest)
            });
            this._q.all([bundlePromise, copyPromise]).then(this._onBundleAndCopySuccess.bind(this, cb, time, defer)).catch(this._onDistFail.bind(this, defer));
        }
        else {
            this._logger.error("JSPM is not available:", jspmAvailable);
            process.exit(1);
        }
    };
    return BundleTask;
}(BaseTask_1.BaseTask));
BundleTask.NAME = "bundle";
//extend from defaults of BaseTask
BundleTask.DEFAULTS = extend(true, {}, BaseTask_1.BaseTask.DEFAULTS, {
    bundle: {
        src: "index.js",
        dest: "index.js"
    },
    options: {
        mangle: true,
        minify: true,
        lowResSourceMaps: true,
        sourceMaps: false
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
exports.BundleTask = BundleTask;
