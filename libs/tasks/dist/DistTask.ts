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
export interface IDistTaskOptions{
    scos:string[];
}
export class DistTask{
    protected static readonly DEFAULTS={
    };
    protected _configService = ConfigService.getInstance();
    protected _options:IDistTaskOptions;
    protected _extend = extend;
    protected _path = path;
    constructor(options:IDistTaskOptions){
        this._options = this._extend(true,{},DistTask.DEFAULTS,options);
    }
    run(){
        let sassOptions={
            outputStyle:"compressed"
        };
        let config:IHaztivityCliConfig = this._configService.getConfig();
        let fuseTask = new FuseboxTask(<IFuseBoxTaskConfig>{
            fusebox: {
                homeDir: this._path.join(config.homeDir),
                sourceMaps:false,
                outFile:"bundle.js",
                log:true,
                plugins:[
                    [FuseBoxStatic.SassPlugin(sassOptions),FuseBoxStatic.CSSPlugin()],
                    FuseBoxStatic.CSSPlugin(),
                    [FuseBoxStatic.SassPlugin(sassOptions),FuseBoxStatic.CSSResourcePlugin({})],
                    FuseBoxStatic.CSSResourcePlugin({}),
                    FuseBoxStatic.HTMLPlugin(),
                    PugPlugin(),
                    FuseBoxStatic.UglifyJSPlugin(config.dist.uglify)
                ]
            },
            copy:config.dist.copy,
            outDir:this._path.normalize(config.dist.outputDir),
            sco:this._options.scos[0]
        });
        return fuseTask.bundle();
    }
}