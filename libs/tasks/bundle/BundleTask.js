"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const extend = require("extend");
//import {JspmUtils} from "@sokka/gulp-build-tasks/JspmUtils";
const BaseTask_1 = require("@sokka/gulp-build-tasks/libs/tasks/BaseTask");
const ConfigService_1 = require("../../ConfigService");
const path = require("path");
const notify = require("node-notifier");
const gulpStreamToPromise = require("gulp-stream-to-promise");
const q = require("q");
const jspm = require("jspm");
const Logger_1 = require("@sokka/gulp-build-tasks/libs/Logger");
const haztivityCliConfig = ConfigService_1.ConfigService.getInstance().getConfig();
/**
 * @class DiscTask
 * @extends BaseTask
 * @description Tarea de distribución
 */
class BundleTask extends BaseTask_1.BaseTask {
    constructor(options) {
        super();
        this._name = "bundle";
        this._nodeNotify = notify;
        this._gulpStreamToPromise = gulpStreamToPromise;
        this._q = q;
        this._logger.setLevel(Logger_1.LoggerLevel.verbose);
        this._options = this._joinOptions(options);
        this._jspmUtils = jspm; //JspmUtils.getInstance();
    }
    _getDefaults() {
        return BundleTask.DEFAULTS;
    }
    /**
     * Genera el bundle mediante jspm
     * @param {IRunConfig}  options Configuración a aplicar
     * @private
     */
    _makeBundle(options) {
        //todo resolve src path
        let defer = this._q.defer(), src = this._path.join(this._options.src.path, this._options.bundle.src), dest = this._path.join(this._options.dest.path, this._options.bundle.dest);
        this._logger.log(this._name, `JSPM bundle-sfx src:${src}`);
        this._logger.log(this._name, `JSPM bundle-sfx dest:${dest}`);
        try {
            this._jspmUtils.bundleSFX(src, dest, options).then(this._onBundleSuccess.bind(this, defer)).catch(this._onDistFail.bind(this, defer));
        }
        catch (e) {
            this._onDistFail(defer, e);
        }
        return defer.promise;
    }
    /**
     * Invocado al finalizarse la tarea satisfactoriamente
     * @private
     */
    _onDistSuccess(cb) {
        this._nodeNotify.notify({
            title: this._name,
            message: "Bundle sfx created"
        });
        cb();
    }
    /**
     * Invocado al fallar la tarea
     * @param err
     * @private
     */
    _onDistFail(defer, err) {
        this._nodeNotify.notify({
            title: this._name,
            message: err.stack
        });
        defer.reject(err);
        throw err;
    }
    /**
     * Invocado al generarse el bundle satisfactoriamente
     * @private
     */
    _onBundleSuccess(defer) {
        defer.resolve();
    }
    _copy(files, dest) {
        let stream = this._vfs.src(files)
            .pipe(this._gulpPlumber({ errorHandler: this._gulpNotifyError() })) //notifyError generates the config
            .pipe(this._options.verbose
            ? this._gulpDebug({ title: this._getLogMessage("Files") })
            : this._gutil.noop()).pipe(this._vfs.dest(dest.path, dest.options));
        let promise = this._gulpStreamToPromise(stream);
        return promise;
    }
    /**
     * Resolve the path of the files to watch prepending the src
     * @returns {Array}
     * @private
     */
    _resolveFiles(files) {
        let result = [], src = this._options.base;
        if (!Array.isArray(files)) {
            files = [files];
        }
        for (let file of files) {
            result.push(this._path.join(src, file));
        }
        return result;
    }
    //make bundle
    //copy dependencies
    //copy others
    run(cb, options = {}) {
        let defer = this._q.defer();
        let _options = this._extend(true, {}, this._options.bundle.options || {}, options);
        let bundlePromise = this._makeBundle(_options);
        let copyPromise = this._copy(this._resolveFiles(this._options.bundle.copy), {
            path: this._options.dest.path
        });
        this._q.all([bundlePromise, copyPromise]).then(this._onDistSuccess.bind(this, cb)).catch(this._onDistFail.bind(this, defer));
    }
}
BundleTask.NAME = "bundle";
//extend from defaults of BaseTask
BundleTask.DEFAULTS = extend(true, {}, BaseTask_1.BaseTask.DEFAULTS, {
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
exports.BundleTask = BundleTask;
//# sourceMappingURL=BundleTask.js.map