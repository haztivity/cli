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
export interface IDevTaskOptions{
    sco:string;
    server?:IFuseBoxServerOptions
}
export class DevTask{
    protected static readonly DEFAULTS={
        server:{}
    };
    protected _configService = ConfigService.getInstance();
    protected _options:IDevTaskOptions;
    protected _extend = extend;
    protected _path = path;
    constructor(options:IDevTaskOptions){
        this._options = this._extend(true,{},DevTask.DEFAULTS,options);
    }
    run(){
        let sassOptions={
            outputStyle:"expanded"
        };
        let config:IHaztivityCliConfig = this._configService.getConfig();
        let serverOptions = this._extend(true,{},config.dev.server || {},this._options.server);
        let fuseTask = new FuseboxTask(<IFuseBoxTaskConfig>{
            fusebox: {
                homeDir: this._path.join(config.homeDir),
                sourceMaps:true,
                log:true,
                outFile:"bundle.js",
                plugins:[
                    [FuseBoxStatic.SassPlugin(sassOptions),FuseBoxStatic.CSSPlugin()],
                    FuseBoxStatic.CSSPlugin(),
                    [FuseBoxStatic.SassPlugin(sassOptions),FuseBoxStatic.CSSResourcePlugin({})],
                    FuseBoxStatic.CSSResourcePlugin({}),
                    FuseBoxStatic.HTMLPlugin(),
                    PugPlugin()
                ]
            },
            outDir:this._path.join(config.homeDir,"..",config.dev.outputDir),
            sco:this._options.sco,
            server:serverOptions,
        });
        fuseTask.devServer();
    }
}