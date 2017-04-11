/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as path from "path";
import {IDistTaskOptions} from "./tasks/dist/DistTask";
import {ITaskOptions} from "@sokka/gulp-build-tasks/libs/tasks/BaseTask";
export interface HaztivityCliConfig extends ITaskOptions{
    dest:{
        exclude?:String[];
        path:string;
    },
    src:{
        path:string;
    },
    bundle:IDistTaskOptions
}
export class ConfigService{
    protected static _instance:ConfigService;
    protected _config:HaztivityCliConfig;
    protected _path = path;
    constructor(){
        this.loadConfig();
    }
    protected _readConfigFile(){
        return require(this._path.join(process.cwd(),"haztivitycli.config.js"));
    }
    public loadConfig(){
        let config = this._readConfigFile();
        if(config){
            this._config = config.config;
        }
    }
    public getConfig():HaztivityCliConfig{
        return this._config;
    }
    public static getInstance():ConfigService{
        if(!ConfigService._instance){
            ConfigService._instance = new ConfigService();
        }
        return ConfigService._instance;
    }
}