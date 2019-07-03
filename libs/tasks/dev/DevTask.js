"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
const FuseBoxStatic = require("fuse-box");
const FuseboxTask_1 = require("../FuseboxTask");
const ConfigService_1 = require("../../ConfigService");
const fusebox_pug_plugin_1 = require("fusebox-pug-plugin");
const autoprefixer = require("autoprefixer");
const extend = require("extend");
const path = require("path");
class DevTask {
    constructor(options) {
        this._configService = ConfigService_1.ConfigService.getInstance();
        this._extend = extend;
        this._path = path;
        this._options = this._extend(true, {}, DevTask.DEFAULTS, options);
    }
    cancel() {
        if (this._fuseTask) {
            try {
                this._fuseTask.cancel();
            }
            catch (e) { }
        }
    }
    run() {
        let config = this._configService.getConfig();
        let sassOptions = this._extend(true, {}, DevTask.SASS_DEFAULTS, config.dev.sass);
        let serverOptions = this._extend(true, {}, config.dev.server || {}, this._options.server);
        let fuseOptions = this._extend(true, {}, config.dev.fusebox);
        fuseOptions.homeDir = this._path.join(config.homeDir);
        fuseOptions.plugins = [
            [FuseBoxStatic.SassPlugin(sassOptions), FuseBoxStatic.CSSPlugin()],
            [FuseBoxStatic.CSSPlugin()],
            [FuseBoxStatic.SassPlugin(sassOptions), FuseBoxStatic.CSSResourcePlugin({})],
            [FuseBoxStatic.CSSResourcePlugin({})],
            FuseBoxStatic.HTMLPlugin(),
            fusebox_pug_plugin_1.PugPlugin({
                useDefault: true,
                hmr: false
            }),
            FuseBoxStatic.ReplacePlugin({ "process.env.NODE_ENV": JSON.stringify("dev") })
        ];
        if (config.dev.autoprefixer) {
            const autoPref = autoprefixer(config.dev.autoprefixer === true ? null : config.dev.autoprefixer), plugin = FuseBoxStatic.PostCSS([autoPref]);
            fuseOptions.plugins[0] = [FuseBoxStatic.SassPlugin(sassOptions), plugin, FuseBoxStatic.CSSPlugin()];
            fuseOptions.plugins[1] = [plugin, FuseBoxStatic.CSSPlugin()];
            fuseOptions.plugins[2] = [FuseBoxStatic.SassPlugin(sassOptions), plugin, FuseBoxStatic.CSSResourcePlugin({})];
            fuseOptions.plugins[3] = [plugin, FuseBoxStatic.CSSResourcePlugin({})];
        }
        let fuseTask = new FuseboxTask_1.FuseboxTask({
            fusebox: fuseOptions,
            bundleExpression: config.dev.bundleExpression,
            outDir: this._path.join(config.homeDir, "..", config.dev.outputDir),
            sco: this._options.sco,
            server: serverOptions,
        });
        this._fuseTask = fuseTask;
        return fuseTask.devServer();
    }
}
DevTask.DEFAULTS = {
    server: {}
};
DevTask.SASS_DEFAULTS = {
    outputStyle: "expanded",
    importer: true
};
exports.DevTask = DevTask;
//# sourceMappingURL=DevTask.js.map