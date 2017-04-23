"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FuseBoxStatic = require("fuse-box");
const vfs = require("vinyl-fs");
const htmlReplace = require("gulp-html-replace");
const path = require("path");
const mapStream = require("map-stream");
const q = require("q");
const Logger_1 = require("../logger/Logger");
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
class FuseboxTask {
    constructor(options) {
        this._FuseBoxStatic = FuseBoxStatic;
        this._FuseBox = this._FuseBoxStatic.FuseBox;
        this._path = path;
        this._vfs = vfs;
        this._mapStream = mapStream;
        this._htmlReplace = htmlReplace;
        this._logger = Logger_1.Logger.getInstance();
        this._q = q;
        // todo check if sco exists
        // todo validate options
        // create fusebox options
        this._options = options;
        this._homeDir = this._options.fusebox.homeDir;
        this._options.fusebox.homeDir = this._path.resolve(this._homeDir);
        this._outDirSco = this._path.join(this._options.outDir, this._options.sco);
        this._outFile = this._path.join(this._outDirSco, this._options.fusebox.outFile);
    }
    _parseOptions() {
    }
    _init() {
    }
    _logFile(prefix, file, cb) {
        this._logger.trace(prefix, this._logger.color.cyan(file.path));
        cb(null, file);
    }
    _copy(toCopy = [], target) {
        this._logger.info("Copying files");
        this._logger.trace(`Dest directory: ${this._logger.color.cyan(target)} ,`, `\nGlobs to copy:\n`, toCopy);
        let defer = this._q.defer();
        this._vfs.src(toCopy)
            .pipe(this._mapStream(this._logFile.bind(this, "Copy:")))
            .pipe(this._vfs.dest(target))
            .on('end', () => defer.resolve());
        return defer.promise;
    }
    _injectBundlePath(toInject, bundlePath) {
        let defer = this._q.defer();
        this._logger.info("Injecting bundle path");
        this._vfs.src(toInject)
            .pipe(this._mapStream(this._logFile.bind(this, this._logger.color.yellow("Search for inject in "))))
            .pipe(this._htmlReplace({
            "bundle": bundlePath
        }, {
            keepBlockTags: true,
            resolvePaths: true
        }))
            .pipe(this._vfs.dest((file) => {
            this._logger.info(this._logger.color.green("Injected bundle in "), this._logger.color.cyan(file.path));
            return file.base;
        }))
            .on('end', () => defer.resolve());
        return defer.promise;
    }
    _initFuse() {
        this._options.fusebox.outFile = this._path.resolve(this._outFile);
        let fuse = this._FuseBox.init(this._options.fusebox);
        return fuse;
    }
    bundle() {
        this._logger.info(`Making bundle for sco ${this._logger.color.cyan(this._options.sco)}`);
        let defer = this._q.defer();
        let fuse = this._initFuse();
        let promise = this._copy(this._options.copy, this._path.resolve(this._options.outDir));
        promise.then(() => {
            this._injectBundlePath(this._path.resolve(this._outDirSco, "**", "*.html"), this._path.resolve(this._outFile)).then(() => defer.resolve());
            this._logger.trace(`Bundle: sco path ${this._logger.color.cyan(this._path.resolve(this._options.fusebox.homeDir, this._options.sco))} to ${this._logger.color.cyan(this._path.resolve(this._outFile))}`);
            fuse.bundle(this._options.bundleExpression.replace("{{sco}}", this._options.sco).replace("\\", "/"));
        });
        return defer.promise;
    }
    devServer() {
        this._logger.info(`Dev server for sco ${this._logger.color.cyan(this._options.sco)}`);
        let fuse = this._initFuse();
        console.log(this._path.resolve(this._path.resolve(this._homeDir, this._options.sco, "**", "*.html")));
        let promise = this._injectBundlePath(this._path.resolve(this._homeDir, this._options.sco, "**", "*.html"), this._outFile);
        promise.then(() => {
            this._logger.trace(`Bundle: sco path ${this._logger.color.cyan(this._path.resolve(this._options.fusebox.homeDir, this._options.sco))} to ${this._logger.color.cyan(this._path.resolve(this._outFile))}`);
            fuse.devServer(this._options.bundleExpression.replace("{{sco}}", this._options.sco).replace("\\", "/"), this._options.server);
        });
    }
}
exports.FuseboxTask = FuseboxTask;
//# sourceMappingURL=FuseboxTask.js.map