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
const extend = require("extend");
const path = require("path");
const autoprefixer = require("autoprefixer");
class DistTask {
    constructor(options) {
        this._configService = ConfigService_1.ConfigService.getInstance();
        this._extend = extend;
        this._path = path;
        this._options = this._extend(true, {}, DistTask.DEFAULTS, options);
    }
    run() {
        let config = this._configService.getConfig();
        let sassOptions = this._extend(true, {}, DistTask.SASS_DEFAULTS, config.dist.sass);
        let fuseOptions = this._extend(true, {}, config.dist.fusebox);
        fuseOptions.homeDir = this._path.join(config.homeDir);
        fuseOptions.plugins = [
            [FuseBoxStatic.SassPlugin(sassOptions), FuseBoxStatic.CSSPlugin()],
            [FuseBoxStatic.CSSPlugin()],
            [FuseBoxStatic.SassPlugin(sassOptions), FuseBoxStatic.CSSResourcePlugin({})],
            [FuseBoxStatic.CSSResourcePlugin({})],
            FuseBoxStatic.HTMLPlugin(),
            fusebox_pug_plugin_1.PugPlugin({
                useDefault: true,
                hmr: false,
                pug: {
                    pretty: false
                }
            }),
            FuseBoxStatic.UglifyJSPlugin(config.dist.uglify)
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
            bundleExpression: config.dist.bundleExpression,
            copy: config.dist.copy,
            outDir: this._path.normalize(config.dist.outputDir),
            sco: this._options.scos[0]
        });
        return fuseTask.bundle();
    }
}
DistTask.DEFAULTS = {};
DistTask.SASS_DEFAULTS = {
    outputStyle: "compressed",
    importer: true
};
exports.DistTask = DistTask;
//# sourceMappingURL=DistTask.js.map