/**
 * @license
 * Copyright Davinchi. All Rights Reserved.
 */
import * as path from "path";
import {IBundleTaskOptions} from "./tasks/bundle/BundleTask";
import {ITaskOptions} from "@sokka/gulp-build-tasks/libs/tasks/BaseTask";
import {Logger} from "@sokka/gulp-build-tasks/libs/Logger";
import * as extend from "extend";
export interface IHaztivityCliConfig extends ITaskOptions{
    dest:{
        exclude?:String[];
        path:string;
    },
    src:{
        path:string;
    },
    bundle:IBundleTaskOptions
}
export class ConfigService{
    protected static _instance:ConfigService;
    protected _config:IHaztivityCliConfig;
    protected _path = path;
    protected _logger = Logger.getInstance();
    protected _extend = extend;
    constructor(){
        this.loadConfig();
    }
    protected _readConfigFile():IHaztivityCliConfig{
        let result = null;
        try{
            result = require(this._path.join(process.cwd(),"haztivitycli.config.js"));
            if(result.config){
                result = result.config
                if(!result.src || !result.src.path || !result.dest || !result.dest.path){
                    result = null;
                }
            }
        }catch(e){
        }
        return result;
    }
    public loadConfig(){
        let config = this._readConfigFile();
        if(config){
            this._config = config;
        }else{
            this._logger.error("Haztivity","haztivitycli.config.js not found. Please init haztivity");
        }
    }
    public getConfig():IHaztivityCliConfig{
        return this._config;
    }
    public static getInstance():ConfigService{
        if(!ConfigService._instance){
            ConfigService._instance = new ConfigService();
        }
        return ConfigService._instance;
    }
}