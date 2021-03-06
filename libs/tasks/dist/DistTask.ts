/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as FuseBoxStatic from "fuse-box";
import {FuseboxTask,IFuseBoxTaskConfig, IFuseBoxServerOptions} from "../FuseboxTask";
import {ConfigService, IHaztivityCliConfig} from "../../ConfigService";
import {PugPlugin} from "fusebox-pug-plugin";
import * as extend from "extend";
import * as path from "path";
import * as autoprefixer from "autoprefixer";
export interface IDistTaskOptions{
    scos:string[];
}
export class DistTask{
    protected static readonly DEFAULTS={
    };
    protected static readonly SASS_DEFAULTS = {
        outputStyle:"compressed",
        importer:true
    };
    protected _configService = ConfigService.getInstance();
    protected _options:IDistTaskOptions;
    protected _extend = extend;
    protected _path = path;
    constructor(options:IDistTaskOptions){
        this._options = this._extend(true,{},DistTask.DEFAULTS,options);
    }
    run(){
        let config:IHaztivityCliConfig = this._configService.getConfig();
        let sassOptions = this._extend(true,{},DistTask.SASS_DEFAULTS,config.dist.sass);
        let fuseOptions = this._extend(true,{},config.dist.fusebox);
        fuseOptions.homeDir= this._path.join(config.homeDir);
        fuseOptions.plugins=[
            [FuseBoxStatic.SassPlugin(sassOptions),FuseBoxStatic.CSSPlugin()],
            [FuseBoxStatic.CSSPlugin()],
            [FuseBoxStatic.SassPlugin(sassOptions),FuseBoxStatic.CSSResourcePlugin({})],
            [FuseBoxStatic.CSSResourcePlugin({})],
            FuseBoxStatic.HTMLPlugin(),
            PugPlugin({
                useDefault:true,
                hmr:false,
                pug:{
                    pretty:false
                }
            }),
            FuseBoxStatic.ReplacePlugin({"process.env.NODE_ENV":JSON.stringify("prod")}),
            FuseBoxStatic.UglifyJSPlugin(config.dist.uglify)
        ];
        if (config.dev.autoprefixer) {
            const autoPref = autoprefixer(config.dev.autoprefixer === true ? null : config.dev.autoprefixer),
                plugin = FuseBoxStatic.PostCSS([autoPref]);
            fuseOptions.plugins[0]=  [FuseBoxStatic.SassPlugin(sassOptions),plugin, FuseBoxStatic.CSSPlugin()];
            fuseOptions.plugins[1] = [plugin,FuseBoxStatic.CSSPlugin()];
            fuseOptions.plugins[2] = [FuseBoxStatic.SassPlugin(sassOptions), plugin, FuseBoxStatic.CSSResourcePlugin({})];
            fuseOptions.plugins[3] = [plugin,FuseBoxStatic.CSSResourcePlugin({})];
        }
        let fuseTask = new FuseboxTask(<IFuseBoxTaskConfig>{
            fusebox: fuseOptions,
            bundleExpression:config.dist.bundleExpression,
            copy:config.dist.copy,
            outDir:this._path.normalize(config.dist.outputDir),
            sco:this._options.scos[0]
        });
        return fuseTask.bundle();
    }
}
